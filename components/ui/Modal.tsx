"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accessible modal using native <dialog>.
 * Closes on Escape and backdrop click.
 */
export function Modal({ open, onClose, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 w-full max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] m-auto p-0",
        "rounded-xl border border-neutral-600 bg-primary shadow-xl",
        "backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        "focus:outline-none",
        className
      )}
      onClose={onClose}
    >
      {children}
    </dialog>
  );
}
