import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-800 text-neutral-300",
  accent: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  danger: "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: BadgeTone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
