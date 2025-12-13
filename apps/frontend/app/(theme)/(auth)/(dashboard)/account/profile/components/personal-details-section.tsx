"use client";

import { useState } from "react";
import { Card } from "./card";
import { Field } from "./field";
import { EditModal } from "./edit-modal";

export function PersonalDetailsSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        title="Personal details"
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-md text-foreground cursor-pointer bg-[var(--color-surface)] px-3 py-1 text-sm hover:bg-[var(--color-muted)]"
          >
            Edit
          </button>
        }
      >
        <Field label="Legal first name" value="Hoang" />
        <Field label="Legal last name" value="Vu Le" />
        <Field label="Date of birth" value="Mar 18th, 1996" />
        <Field label="Citizen of" value="Vietnam 🇻🇳" />
        <Field label="Timezone" value="Asia – Bangkok (12:44)" />
        <Field label="Country of tax residence" value="Vietnam 🇻🇳" />
      </Card>

      <EditModal
        open={open}
        title="Edit personal details"
        onClose={() => setOpen(false)}
      >
        <Input label="First name" defaultValue="Hoang" />
        <Input label="Last name" defaultValue="Vu Le" />
        <Input label="Date of birth" type="date" />
      </EditModal>
    </>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-500">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border border-[var(--color-muted)] bg-[var(--color-background)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
      />
    </div>
  );
}
