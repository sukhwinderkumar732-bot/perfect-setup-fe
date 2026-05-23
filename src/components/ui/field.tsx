import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldShellProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FieldShell({ label, error, children }: FieldShellProps) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <FieldShell label={label} error={error}>
      <input className="input" {...props} />
    </FieldShell>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function SelectField({ label, error, children, ...props }: SelectFieldProps) {
  return (
    <FieldShell label={label} error={error}>
      <select className="select" {...props}>
        {children}
      </select>
    </FieldShell>
  );
}

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextareaField({ label, error, ...props }: TextareaFieldProps) {
  return (
    <FieldShell label={label} error={error}>
      <textarea className="textarea" {...props} />
    </FieldShell>
  );
}
