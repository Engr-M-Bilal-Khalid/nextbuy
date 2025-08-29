import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Variant {
  variantId: string;
  name: string;
  color: string;
}

interface VariantRadioGroupProps {
  variants: Variant[];
  value?: string;                      // selected variant's id
  onChange?: (variantId: string) => void;
  padding?:Boolean
}

export function VariantRadioGroup({
  variants,
  value,
  onChange,
  padding
}: VariantRadioGroupProps) {
  const [internalValue, setInternalValue] = useState<string>(
    value ?? variants[0]?.variantId
  );

  const selectedId = value ?? internalValue;

  const handleChange = (variantid: string) => {
    if (!value) setInternalValue(variantid);
    onChange?.(variantid);
  };

  return (
    <RadioGroup
      value={selectedId}
      onValueChange={handleChange}
      className="flex space-x-1"
    >
      {variants.map((variant,i) => (
        <label
          key={variant.variantId}
          className={cn("cursor-pointer flex flex-col items-center gap-[1px]",padding && i !== 0 && `px-4`)}
        >
          <RadioGroupItem value={variant.variantId} id={variant.variantId} className="hidden" />
          <div
            className={cn(
              "size-3 rounded-full my-1",
              selectedId === variant.variantId
                ? "ring-2 ring-offset-1 ring-gray-400"
                : "ring-0"
            )}
            style={{
              backgroundColor: variant.color
            }}
          />


        </label>
      ))}
    </RadioGroup>
  );
}
