
CREATE OR REPLACE FUNCTION public.public_business_info()
RETURNS TABLE (business_name text, business_whatsapp text, instagram_url text, contact_email text, address text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT business_name, business_whatsapp, instagram_url, contact_email, address
  FROM public.business_settings ORDER BY created_at LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.public_business_info() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.public_booking_by_code(p_code text)
RETURNS TABLE (
  booking_code text, cabin_name text, cabin_slug text, check_in date, check_out date,
  nights int, guests int, accommodation_subtotal numeric, cleaning_fee numeric,
  total_amount numeric, status public.booking_status, guest_first_name text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.booking_code, c.name, c.slug, b.check_in, b.check_out, b.nights, b.guests,
         b.accommodation_subtotal, b.cleaning_fee, b.total_amount, b.status,
         split_part(b.guest_name, ' ', 1)
  FROM public.bookings b JOIN public.cabins c ON c.id = b.cabin_id
  WHERE b.booking_code = upper(btrim(p_code));
$$;
GRANT EXECUTE ON FUNCTION public.public_booking_by_code(text) TO anon, authenticated, service_role;
