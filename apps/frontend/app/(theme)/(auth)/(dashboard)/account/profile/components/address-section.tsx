import { Pencil } from "lucide-react";
import { Card } from "./card";
import { Field } from "./field";

export function AddressSection() {
  return (
    <Card title="Address">
      <Field
        label="Personal address"
        value={
          <div className="text-right leading-tight">
            <div>Vietnam</div>
            <div>Ho Chi Minh</div>
            <div>90000</div>
          </div>
        }
        trailing={<Pencil className="h-4 w-4 text-slate-400" />}
      />

      <Field
        label="Postal address (optional)"
        value={
          <div className="text-right leading-tight">
            <div>Vietnam</div>
            <div>Ho Chi Minh</div>
            <div>90000</div>
          </div>
        }
        trailing={<Pencil className="h-4 w-4 text-slate-400" />}
      />
    </Card>
  );
}
