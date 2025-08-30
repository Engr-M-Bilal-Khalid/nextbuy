import { Suspense } from "react";
import VerifyEmailPage from "@/components/wrappers/verifyEmailWrapperPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
