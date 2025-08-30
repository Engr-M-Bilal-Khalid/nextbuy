import { Suspense } from "react";
import ThankYouPageWrapper from "@/components/wrappers/thankUWrapper";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouPageWrapper />
    </Suspense>
  );
}
