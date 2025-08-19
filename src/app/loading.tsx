import { LoadingPage } from "@/components/ui/loading";

export default function RootLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center">
        <LoadingPage
          title="Loading Mzansi Footwear..."
          description="Please wait while we prepare your shopping experience"
          className="min-h-0"
        />
      </div>
    </div>
  );
}
