import heroForest from "@/assets/hero-forest.jpg";
import auroraInterior from "@/assets/aurora-interior.jpg";
import selvaExterior from "@/assets/selva-exterior.jpg";
import galleryHidro from "@/assets/gallery-hidro.jpg";
import galleryFogueira from "@/assets/gallery-fogueira.jpg";
import galleryFloresta from "@/assets/gallery-floresta.jpg";

export const IMAGES = {
  heroForest,
  auroraInterior,
  selvaExterior,
  galleryHidro,
  galleryFogueira,
  galleryFloresta,
};

const COVERS: Record<string, string> = {
  aurora: auroraInterior,
  selva: selvaExterior,
};

export function cabinCover(slug: string, coverImage?: string | null): string {
  return coverImage || COVERS[slug] || heroForest;
}

export function cabinGallery(slug: string, gallery?: unknown): string[] {
  if (Array.isArray(gallery) && gallery.length > 0) return gallery as string[];
  const base = slug === "selva" ? selvaExterior : auroraInterior;
  return [base, galleryHidro, galleryFogueira, galleryFloresta, heroForest];
}

export const EDITORIAL_GALLERY = [
  {
    src: auroraInterior,
    alt: "Interior da cabana com cama king e vista para a mata",
    caption: "Sem despertadores.",
  },
  {
    src: galleryHidro,
    alt: "Hidromassagem privativa no deck ao anoitecer",
    caption: "Sem trânsito.",
  },
  {
    src: galleryFogueira,
    alt: "Fogueira acesa no deck de madeira",
    caption: "Sem pressa.",
  },
  { src: galleryFloresta, alt: "Mata nativa ao amanhecer", caption: "Só floresta." },
  { src: selvaExterior, alt: "Cabana Selva vista de fora, entre árvores", caption: "E silêncio." },
];