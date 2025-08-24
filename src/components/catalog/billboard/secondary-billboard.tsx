import { BillboardContainer } from "@/components/catalog/billboard/billboard-container";

export function SecondaryBillboard() {
  return (
    <div className="container mx-auto px-4 py-4">
      <BillboardContainer
        position="FOOTER"
        compact={true}
        className="h-32 md:h-40 rounded-lg"
      />
    </div>
  );
}