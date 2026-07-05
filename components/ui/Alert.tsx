import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "error";

const toneConfig = {
  info: { cls: "border-neutral-700 bg-neutral-900 text-neutral-200", Icon: Info },
  success: { cls: "border-emerald-800 bg-emerald-950/40 text-emerald-200", Icon: CheckCircle2 },
  error: { cls: "border-red-900 bg-red-950/40 text-red-200", Icon: AlertTriangle },
} as const;

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: AlertTone;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { cls, Icon } = toneConfig[tone];
  return (
    <div role="alert" className={cn("flex gap-3 rounded-2xl border p-4 text-sm", cls, className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-1 opacity-90")}>{children}</div>}
      </div>
    </div>
  );
}
