import { cn } from "@/lib/utils/cn";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: "admin" | "user" | "success" | "warning";
};

export function StatusBadge({ children, tone = "user" }: StatusBadgeProps) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}
