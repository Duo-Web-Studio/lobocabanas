import heroForest from "@/assets/hero-forest.jpg";
import auroraInterior from "@/assets/aurora-interior.jpg";
import auroraExterior from "@/assets/aurora-exterior.jpg";
import selvaExterior from "@/assets/selva-exterior.jpg";
import galleryHidro from "@/assets/gallery-hidro.jpg";
import galleryFogueira from "@/assets/gallery-fogueira.jpg";
import galleryFloresta from "@/assets/gallery-floresta.jpg";

export const IMAGES = {
  heroForest,
  auroraInterior,
  auroraExterior,
  selvaExterior,
  galleryHidro,
  galleryFogueira,
  galleryFloresta,
};

const COVERS: Record<string, string> = {
  aurora: auroraExterior,
  selva: selvaExterior,
};

export function cabinCover(slug: string, coverImage?: string | null): string {
  return coverImage || COVERS[slug] || heroForest;
}

export function cabinGallery(slug: string, gallery?: unknown): string[] {
  if (Array.isArray(gallery) && gallery.length > 0) return gallery as string[];
  const base = slug === "selva" ? selvaExterior : auroraExterior;
  return [base, auroraInterior, galleryHidro, galleryFogueira, galleryFloresta];
}

export const EDITORIAL_GALLERY = [
  {
    src: auroraInterior,
    alt: "Interior da cabana A-Frame com teto inclinado de madeira e cama king",
    caption: "Sem despertadores.",
  },
  {
    src: galleryHidro,
    alt: "Ofurô privativo no deck de madeira ao anoitecer, entre as árvores",
    caption: "Sem trânsito.",
  },
  {
    src: galleryFogueira,
    alt: "Fogueira de pedra acesa em frente à cabana A-Frame iluminada",
    caption: "Sem pressa.",
  },
  {
    src: galleryFloresta,
    alt: "Trilha de pedra na mata fechada levando à cabana escondida",
    caption: "Só floresta.",
  },
  {
    src: selvaExterior,
    alt: "Cabana Selva, chalé A-Frame de madeira cercado por árvores altas",
    caption: "E silêncio.",
  },
];