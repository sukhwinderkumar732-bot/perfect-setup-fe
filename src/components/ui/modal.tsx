"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

type ModalProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  open: boolean;
  onClose: () => void;
};

export function Modal({ title, children, footer, open, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header actions-row">
          <strong>{title}</strong>
          <Button type="button" variant="ghost" iconOnly aria-label="Close modal" onClick={onClose}>
            <X size={18} />
          </Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
