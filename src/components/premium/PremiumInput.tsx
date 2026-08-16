import { forwardRef, useId } from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string | undefined;
  className?: string;
};

const fieldClass =
  "w-full bg-transparent border-b border-border px-0 py-3 text-[0.95rem] text-ivory placeholder:text-mist/45 outline-none transition-colors duration-500 focus:border-sage disabled:opacity-50";

export const PremiumInput = forwardRef<
  HTMLInputElement,
  FieldProps & React.InputHTMLAttributes<HTMLInputElement>
>(function PremiumInput({ label, hint, error, className, ...props }, ref) {
  const id = useId();
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className="eyebrow block pb-1.5">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClass, error && "border-destructive")}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="pt-2 text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="pt-2 text-xs text-mist/70">{hint}</p>
      ) : null}
    </div>
  );
});

export const PremiumTextarea = forwardRef<
  HTMLTextAreaElement,
  FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function PremiumTextarea({ label, hint, error, className, ...props }, ref) {
  const id = useId();
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className="eyebrow block pb-1.5">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        rows={3}
        aria-invalid={Boolean(error)}
        className={cn(fieldClass, "resize-none", error && "border-destructive")}
        {...props}
      />
      {error ? (
        <p className="pt-2 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="pt-2 text-xs text-mist/70">{hint}</p>
      ) : null}
    </div>
  );
});