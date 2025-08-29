import { PlaceholdersAndVanishInput as AcertinityInput } from "@/components/acertinityUI/input";

export default function ResponsiveSearch({ placeholders, onChange, onSubmit }: any) {
  return (
    <AcertinityInput
      className="lg:hidden px-[2.5%] w-[95%]"
      placeholders={placeholders}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
