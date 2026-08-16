
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('super_admin','cabin_admin');
CREATE TYPE public.cabin_status AS ENUM ('active','inactive','maintenance');
CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','cancelled','completed');
CREATE TYPE public.notification_status AS ENUM ('pending','sent','failed','disabled');
CREATE TYPE public.notification_target AS ENUM ('business','cabin_admin','both');

-- UPDATED_AT HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  whatsapp_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CABINS
CREATE TABLE public.cabins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  max_guests int NOT NULL DEFAULT 2,
  bedrooms int NOT NULL DEFAULT 1,
  beds int NOT NULL DEFAULT 1,
  bathrooms int NOT NULL DEFAULT 1,
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  cleaning_fee numeric(10,2) NOT NULL DEFAULT 0,
  status public.cabin_status NOT NULL DEFAULT 'active',
  cover_image text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_number text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cabins TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cabins TO authenticated;
GRANT ALL ON public.cabins TO service_role;
ALTER TABLE public.cabins ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER cabins_updated_at BEFORE UPDATE ON public.cabins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CABIN ADMINS
CREATE TABLE public.cabin_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cabin_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.cabin_admins TO authenticated;
GRANT ALL ON public.cabin_admins TO service_role;
ALTER TABLE public.cabin_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.manages_cabin(_user_id uuid, _cabin_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id,'super_admin')
      OR EXISTS (SELECT 1 FROM public.cabin_admins WHERE user_id = _user_id AND cabin_id = _cabin_id);
$$;

-- POLICIES: profiles / roles / cabin_admins
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(),'super_admin'))
WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "roles read own" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "cabin_admins read" ON public.cabin_admins FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "cabin_admins manage" ON public.cabin_admins FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- CABINS POLICIES
CREATE POLICY "cabins public read active" ON public.cabins FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "cabins admin read" ON public.cabins FOR SELECT TO authenticated
USING (status = 'active' OR public.manages_cabin(auth.uid(), id));
CREATE POLICY "cabins admin update" ON public.cabins FOR UPDATE TO authenticated
USING (public.manages_cabin(auth.uid(), id)) WITH CHECK (public.manages_cabin(auth.uid(), id));
CREATE POLICY "cabins super insert" ON public.cabins FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "cabins super delete" ON public.cabins FOR DELETE TO authenticated
USING (public.has_role(auth.uid(),'super_admin'));

-- BUSINESS SETTINGS
CREATE TABLE public.business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'NOMA Forest Cabins',
  business_whatsapp text,
  notification_whatsapp text,
  notification_target public.notification_target NOT NULL DEFAULT 'business',
  instagram_url text,
  contact_email text,
  address text,
  timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
  whatsapp_notifications_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.business_settings TO authenticated;
GRANT ALL ON public.business_settings TO service_role;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings read" ON public.business_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings super update" ON public.business_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DAILY RATES
CREATE TABLE public.cabin_daily_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  date date NOT NULL,
  price numeric(10,2) NOT NULL,
  min_nights int NOT NULL DEFAULT 1,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cabin_id, date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cabin_daily_rates TO authenticated;
GRANT ALL ON public.cabin_daily_rates TO service_role;
ALTER TABLE public.cabin_daily_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rates admin all" ON public.cabin_daily_rates FOR ALL TO authenticated
USING (public.manages_cabin(auth.uid(), cabin_id)) WITH CHECK (public.manages_cabin(auth.uid(), cabin_id));
CREATE TRIGGER rates_updated_at BEFORE UPDATE ON public.cabin_daily_rates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BLOCKED DATES
CREATE TABLE public.cabin_blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabin_id uuid NOT NULL REFERENCES public.cabins(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cabin_blocked_dates TO authenticated;
GRANT ALL ON public.cabin_blocked_dates TO service_role;
ALTER TABLE public.cabin_blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks admin all" ON public.cabin_blocked_dates FOR ALL TO authenticated
USING (public.manages_cabin(auth.uid(), cabin_id)) WITH CHECK (public.manages_cabin(auth.uid(), cabin_id));

-- BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code text NOT NULL UNIQUE,
  cabin_id uuid NOT NULL REFERENCES public.cabins(id) ON DELETE RESTRICT,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  guest_document text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests int NOT NULL,
  adults int NOT NULL DEFAULT 1,
  children int NOT NULL DEFAULT 0,
  nights int NOT NULL,
  accommodation_subtotal numeric(10,2) NOT NULL DEFAULT 0,
  cleaning_fee numeric(10,2) NOT NULL DEFAULT 0,
  additional_fees numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  whatsapp_notification_status public.notification_status NOT NULL DEFAULT 'pending',
  whatsapp_notification_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (check_out > check_in)
);
CREATE INDEX bookings_cabin_dates_idx ON public.bookings (cabin_id, check_in, check_out);
GRANT SELECT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings admin read" ON public.bookings FOR SELECT TO authenticated
USING (public.manages_cabin(auth.uid(), cabin_id));
CREATE POLICY "bookings admin update" ON public.bookings FOR UPDATE TO authenticated
USING (public.manages_cabin(auth.uid(), cabin_id)) WITH CHECK (public.manages_cabin(auth.uid(), cabin_id));
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKING NIGHTS
CREATE TABLE public.booking_nights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  date date NOT NULL,
  nightly_rate numeric(10,2) NOT NULL,
  UNIQUE (booking_id, date)
);
GRANT SELECT ON public.booking_nights TO authenticated;
GRANT ALL ON public.booking_nights TO service_role;
ALTER TABLE public.booking_nights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking_nights admin read" ON public.booking_nights FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND public.manages_cabin(auth.uid(), b.cabin_id)));

-- NOTIFICATION LOGS
CREATE TABLE public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  type text NOT NULL,
  recipient text,
  channel text NOT NULL DEFAULT 'whatsapp',
  status public.notification_status NOT NULL DEFAULT 'pending',
  provider_message_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
GRANT SELECT ON public.notification_logs TO authenticated;
GRANT ALL ON public.notification_logs TO service_role;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs admin read" ON public.notification_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND public.manages_cabin(auth.uid(), b.cabin_id)));

-- PUBLIC CALENDAR (safe: no reasons, no guest data)
CREATE OR REPLACE FUNCTION public.cabin_calendar(p_cabin_id uuid, p_from date, p_to date)
RETURNS TABLE (date date, price numeric, min_nights int, is_available boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT d::date,
         COALESCE(r.price, c.base_price)::numeric,
         COALESCE(r.min_nights, 1)::int,
         (COALESCE(r.is_available, true)
          AND d::date >= (now() AT TIME ZONE 'America/Sao_Paulo')::date
          AND NOT EXISTS (SELECT 1 FROM public.cabin_blocked_dates b
                          WHERE b.cabin_id = c.id AND d::date >= b.start_date AND d::date < b.end_date)
          AND NOT EXISTS (SELECT 1 FROM public.bookings bk
                          WHERE bk.cabin_id = c.id AND bk.status IN ('pending','confirmed')
                            AND d::date >= bk.check_in AND d::date < bk.check_out))::boolean
  FROM public.cabins c
  CROSS JOIN generate_series(p_from, p_to, interval '1 day') d
  LEFT JOIN public.cabin_daily_rates r ON r.cabin_id = c.id AND r.date = d::date
  WHERE c.id = p_cabin_id AND c.status = 'active'
  ORDER BY 1;
$$;
GRANT EXECUTE ON FUNCTION public.cabin_calendar(uuid, date, date) TO anon, authenticated, service_role;

-- BOOKING CODE
CREATE OR REPLACE FUNCTION public.generate_booking_code()
RETURNS text LANGUAGE plpgsql VOLATILE SET search_path = public AS $$
DECLARE chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; code text; i int;
BEGIN
  LOOP
    code := 'NOMA-';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, 1 + floor(random()*length(chars))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.bookings WHERE booking_code = code);
  END LOOP;
  RETURN code;
END; $$;

-- ATOMIC BOOKING CREATION
CREATE OR REPLACE FUNCTION public.create_booking(
  p_cabin_id uuid, p_check_in date, p_check_out date,
  p_adults int, p_children int,
  p_guest_name text, p_guest_email text, p_guest_phone text,
  p_guest_document text DEFAULT NULL, p_notes text DEFAULT NULL
) RETURNS public.bookings
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_cabin public.cabins;
  v_nights int;
  v_guests int;
  v_subtotal numeric(10,2) := 0;
  v_min_nights int := 1;
  v_day date;
  v_rate numeric(10,2);
  v_avail boolean;
  v_booking public.bookings;
  v_rates record;
BEGIN
  SELECT * INTO v_cabin FROM public.cabins WHERE id = p_cabin_id;
  IF v_cabin.id IS NULL OR v_cabin.status <> 'active' THEN RAISE EXCEPTION 'CABIN_UNAVAILABLE'; END IF;

  v_nights := p_check_out - p_check_in;
  v_guests := COALESCE(p_adults,0) + COALESCE(p_children,0);
  IF v_nights < 1 THEN RAISE EXCEPTION 'INVALID_DATES'; END IF;
  IF p_check_in < (now() AT TIME ZONE 'America/Sao_Paulo')::date THEN RAISE EXCEPTION 'PAST_DATES'; END IF;
  IF v_guests < 1 OR COALESCE(p_adults,0) < 1 THEN RAISE EXCEPTION 'INVALID_GUESTS'; END IF;
  IF v_guests > v_cabin.max_guests THEN RAISE EXCEPTION 'CAPACITY_EXCEEDED'; END IF;
  IF coalesce(btrim(p_guest_name),'') = '' OR coalesce(btrim(p_guest_phone),'') = ''
     OR p_guest_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'INVALID_GUEST_DATA'; END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p_cabin_id::text));

  FOR v_rates IN
    SELECT * FROM public.cabin_calendar(p_cabin_id, p_check_in, p_check_out - 1)
  LOOP
    IF NOT v_rates.is_available THEN RAISE EXCEPTION 'DATES_UNAVAILABLE'; END IF;
    v_subtotal := v_subtotal + v_rates.price;
    IF v_rates.date = p_check_in THEN v_min_nights := v_rates.min_nights; END IF;
  END LOOP;

  IF v_nights < v_min_nights THEN RAISE EXCEPTION 'MIN_NIGHTS_%', v_min_nights; END IF;

  INSERT INTO public.bookings (
    booking_code, cabin_id, guest_name, guest_email, guest_phone, guest_document,
    check_in, check_out, guests, adults, children, nights,
    accommodation_subtotal, cleaning_fee, total_amount, status, notes,
    whatsapp_notification_status
  ) VALUES (
    public.generate_booking_code(), p_cabin_id, btrim(p_guest_name), lower(btrim(p_guest_email)),
    btrim(p_guest_phone), nullif(btrim(coalesce(p_guest_document,'')),''),
    p_check_in, p_check_out, v_guests, p_adults, coalesce(p_children,0), v_nights,
    v_subtotal, v_cabin.cleaning_fee, v_subtotal + v_cabin.cleaning_fee, 'pending',
    nullif(btrim(coalesce(p_notes,'')),''), 'pending'
  ) RETURNING * INTO v_booking;

  FOR v_day, v_rate, v_avail IN
    SELECT date, price, is_available FROM public.cabin_calendar(p_cabin_id, p_check_in, p_check_out - 1)
  LOOP
    INSERT INTO public.booking_nights (booking_id, date, nightly_rate) VALUES (v_booking.id, v_day, v_rate);
  END LOOP;

  RETURN v_booking;
END; $$;
REVOKE ALL ON FUNCTION public.create_booking(uuid,date,date,int,int,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking(uuid,date,date,int,int,text,text,text,text,text) TO service_role;

-- SEED
INSERT INTO public.business_settings (business_name, business_whatsapp, notification_whatsapp, instagram_url, contact_email, address)
VALUES ('NOMA Forest Cabins','5564999990000','5564999990000','https://instagram.com/noma.forestcabins','reservas@noma.cabins','Estrada da Mata, Rio Verde · Goiás');

INSERT INTO public.cabins (name, slug, short_description, description, location, max_guests, bedrooms, beds, bathrooms, base_price, cleaning_fee, amenities, display_order)
VALUES
('Aurora','aurora','Refúgio para dois, suspenso entre as árvores.',
 'Aurora é uma cabana privativa de madeira e vidro, desenhada para desaparecer na mata. Luz quente, silêncio absoluto e uma hidromassagem voltada para a floresta.',
 'Rio Verde · Goiás', 2, 1, 1, 1, 690, 150,
 '["Cama king","Hidromassagem privativa","Cozinha equipada","Deck com vista","Fogueira","Wi-Fi","Ar-condicionado"]'::jsonb, 1),
('Selva','selva','Espaço para quatro, cercado por mata nativa.',
 'Selva abraça a floresta com dois quartos, pé-direito alto e vista panorâmica. Pensada para quem quer companhia sem perder o silêncio.',
 'Rio Verde · Goiás', 4, 2, 3, 2, 890, 190,
 '["2 quartos","Hidromassagem privativa","Cozinha equipada","Deck panorâmico","Fogueira","Wi-Fi","Vista panorâmica"]'::jsonb, 2);

INSERT INTO public.cabin_daily_rates (cabin_id, date, price, min_nights)
SELECT c.id, d::date,
  CASE
    WHEN to_char(d,'MM-DD') IN ('12-24','12-25','12-31','01-01') THEN c.base_price * 1.85
    WHEN extract(dow from d) = 6 THEN c.base_price * 1.45
    WHEN extract(dow from d) = 5 THEN c.base_price * 1.15
    ELSE c.base_price
  END,
  CASE WHEN extract(dow from d) IN (5,6) THEN 2 ELSE 1 END
FROM public.cabins c
CROSS JOIN generate_series((now() AT TIME ZONE 'America/Sao_Paulo')::date, (now() AT TIME ZONE 'America/Sao_Paulo')::date + 210, interval '1 day') d;

-- demo bookings (occupied dates)
INSERT INTO public.bookings (booking_code, cabin_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, adults, children, nights, accommodation_subtotal, cleaning_fee, total_amount, status, whatsapp_notification_status, whatsapp_notification_sent_at)
SELECT 'NOMA-DEMO01', c.id, 'João Silva', 'joao.silva@example.com', '5564999998888',
  (now() AT TIME ZONE 'America/Sao_Paulo')::date + 9, (now() AT TIME ZONE 'America/Sao_Paulo')::date + 12,
  2, 2, 0, 3, 2170, c.cleaning_fee, 2170 + c.cleaning_fee, 'confirmed', 'sent', now()
FROM public.cabins c WHERE c.slug = 'aurora';

INSERT INTO public.bookings (booking_code, cabin_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, adults, children, nights, accommodation_subtotal, cleaning_fee, total_amount, status, whatsapp_notification_status)
SELECT 'NOMA-DEMO02', c.id, 'Marina Costa', 'marina@example.com', '5564999997777',
  (now() AT TIME ZONE 'America/Sao_Paulo')::date + 4, (now() AT TIME ZONE 'America/Sao_Paulo')::date + 6,
  4, 3, 1, 2, 1780, c.cleaning_fee, 1780 + c.cleaning_fee, 'pending', 'pending'
FROM public.cabins c WHERE c.slug = 'selva';

INSERT INTO public.booking_nights (booking_id, date, nightly_rate)
SELECT b.id, d::date, COALESCE(r.price, c.base_price)
FROM public.bookings b
JOIN public.cabins c ON c.id = b.cabin_id
CROSS JOIN generate_series(b.check_in, b.check_out - 1, interval '1 day') d
LEFT JOIN public.cabin_daily_rates r ON r.cabin_id = b.cabin_id AND r.date = d::date;

INSERT INTO public.cabin_blocked_dates (cabin_id, start_date, end_date, reason)
SELECT c.id, (now() AT TIME ZONE 'America/Sao_Paulo')::date + 20, (now() AT TIME ZONE 'America/Sao_Paulo')::date + 23, 'Manutenção'
FROM public.cabins c WHERE c.slug = 'aurora';
