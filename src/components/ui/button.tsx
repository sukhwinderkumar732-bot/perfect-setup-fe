import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  iconOnly?: boolean;
};

export function Button({ className, variant = "primary", iconOnly = false, ...props }: ButtonProps) {
  return (
    <button
      className={cn("button", `button-${variant}`, iconOnly && "button-icon", className)}
      {...props}
    />
  );
}
