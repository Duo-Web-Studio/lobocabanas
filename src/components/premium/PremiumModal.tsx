import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function PremiumModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto border-t border-border bg-pine p-6 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[min(34rem,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:border sm:p-8",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <Dialog.Title className="font-display text-2xl text-ivory">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="pt-1 text-sm text-mist">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="rounded-full border border-border p-2 text-mist transition-colors hover:border-sage hover:text-ivory"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="pt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}