import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const nomaButton = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.22em] font-medium transition-all duration-700 ease-[var(--ease-noma)] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        solid: "bg-sage text-background hover:bg-sand",
        outline: "border border-border text-ivory hover:border-sage hover:bg-moss/15",
        ghost: "text-mist hover:text-ivory",
        gold: "border border-gold/45 text-gold hover:bg-gold/10",
        whatsapp: "border border-sage/45 bg-moss/15 text-ivory hover:bg-moss/30",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-14 px-9",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof nomaButton>;

export function NomaButton({ className, variant, size, ...props }: Props) {
  return <button className={cn(nomaButton({ variant, size }), className)} {...props} />;
}