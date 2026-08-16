import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function PremiumSelect({
  label,
  value,
  onValueChange,
  options,
  className,
}: {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? <span className="eyebrow block pb-1.5">{label}</span> : null}
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger
          className="flex w-full items-center justify-between gap-3 border-b border-border bg-transparent py-3 text-left text-sm text-ivory outline-none transition-colors duration-500 focus-visible:border-sage data-[state=open]:border-sage"
          aria-label={label}
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown className="size-3.5 text-mist" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className="z-50 min-w-[12rem] overflow-hidden border border-border bg-pine shadow-[var(--shadow-lift)]"
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-sm text-mist outline-none transition-colors data-[highlighted]:bg-moss/25 data-[highlighted]:text-ivory data-[state=checked]:text-ivory"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="size-3.5 text-sage" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}