import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { getBusinessInfo } from "@/lib/public.functions";

export function useBusinessInfo() {
  const fetchInfo = useServerFn(getBusinessInfo);
  return useQuery({
    queryKey: ["business-info"],
    queryFn: () => fetchInfo(),
    staleTime: 5 * 60_000,
  });
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { data } = useBusinessInfo();
  const whatsapp = data?.whatsapp ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header whatsapp={whatsapp} />
      <main className="flex-1">{children}</main>
      <Footer
        businessName={data?.businessName ?? "NOMA Forest Cabins"}
        whatsapp={whatsapp}
        instagram={data?.instagram ?? null}
        email={data?.email ?? null}
        address={data?.address ?? null}
      />
      <WhatsAppFab whatsapp={whatsapp} />
    </div>
  );
}