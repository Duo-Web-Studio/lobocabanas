import aframeDia from "@/assets/aframe-dia.webp.asset.json";
import aframeHidro from "@/assets/aframe-hidro.webp.asset.json";
import chaleNoite from "@/assets/chale-noite.webp.asset.json";
import chaleSolarium from "@/assets/chale-solarium.webp.asset.json";
import fachadaDetalhe from "@/assets/fachada-detalhe.webp.asset.json";
import fogueiraNoite from "@/assets/fogueira-noite.webp.asset.json";
import hidroSolarium from "@/assets/hidro-solarium.webp.asset.json";
import interiorSuite from "@/assets/interior-suite.webp.asset.json";
import loftJanela from "@/assets/loft-janela.webp.asset.json";
import loftVaranda from "@/assets/loft-varanda.webp.asset.json";

export const IMAGES = {
  heroForest: fogueiraNoite.url,
  auroraExterior: aframeDia.url,
  auroraInterior: loftJanela.url,
  selvaExterior: chaleSolarium.url,
  selvaNoite: chaleNoite.url,
  galleryHidro: aframeHidro.url,
  galleryHidroSolarium: hidroSolarium.url,
  galleryFogueira: fogueiraNoite.url,
  galleryFloresta: fachadaDetalhe.url,
  interiorSuite: interiorSuite.url,
  loftVaranda: loftVaranda.url,
};

const COVERS: Record<string, string> = {
  aurora: aframeDia.url,
  selva: chaleSolarium.url,
};

export function cabinCover(slug: string, coverImage?: string | null): string {
  return coverImage || COVERS[slug] || fogueiraNoite.url;
}

const GALLERIES: Record<string, string[]> = {
  aurora: [
    aframeDia.url,
    aframeHidro.url,
    loftVaranda.url,
    loftJanela.url,
    fachadaDetalhe.url,
    fogueiraNoite.url,
  ],
  selva: [
    chaleSolarium.url,
    chaleNoite.url,
    interiorSuite.url,
    hidroSolarium.url,
    fogueiraNoite.url,
  ],
};

export function cabinGallery(slug: string, gallery?: unknown): string[] {
  if (Array.isArray(gallery) && gallery.length > 0) return gallery as string[];
  return GALLERIES[slug] ?? GALLERIES["aurora"]!;
}

export const EDITORIAL_GALLERY = [
  {
    src: loftJanela.url,
    alt: "Vista da janela triangular do loft da cabana A-Frame para a mata",
    caption: "Sem despertadores.",
  },
  {
    src: aframeHidro.url,
    alt: "Hidromassagem no deck de madeira ao lado da cabana A-Frame",
    caption: "Sem trânsito.",
  },
  {
    src: fogueiraNoite.url,
    alt: "Fogueira acesa à noite com luzes penduradas entre as árvores",
    caption: "Sem pressa.",
  },
  {
    src: loftVaranda.url,
    alt: "Porta triangular do loft aberta para a varanda de madeira sobre a mata",
    caption: "Só floresta.",
  },
  {
    src: chaleNoite.url,
    alt: "Chalé de madeira iluminado à noite entre as árvores",
    caption: "E silêncio.",
  },
];