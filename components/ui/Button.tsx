"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const useNativeAnchorForHref = true;

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#EAE6E1] text-[#131210] hover:bg-[#C5B397] border-transparent",
  secondary:
    "border border-[#EAE6E1]/30 text-[#EAE6E1] bg-transparent hover:bg-[#EAE6E1]/5",
  ghost:
    "text-[#EAE6E1]/60 bg-transparent hover:text-[#C5B397] border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm:  "px-6 py-3 text-[9px]",
  md:  "px-10 py-4 text-[10px]",
  lg:  "px-12 py-5 text-[10px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  asChild,
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center uppercase tracking-[0.3em] font-medium cursor-pointer transition-colors duration-500 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const combined = cn(base, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    if (useNativeAnchorForHref) {
      return (
        <a href={href} className={combined} role={asChild ? undefined : "button"}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={combined} {...props}>
      {children}
    </button>
  );
}
