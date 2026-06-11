import { OnboardingForm } from "@/components/onboarding-form";
import { PageShell } from "@/components/page-shell";
import { BRAND_NAME } from "@/lib/brand";
import { getAppSession } from "@/lib/app-session";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Choose username — ${BRAND_NAME}`,
};

export default async function OnboardingPage() {
  const session = await getAppSession();
  if (!session?.user) {
    redirect("/auth/login?returnTo=/onboarding");
  }
  if (session.user.username) {
    redirect("/dashboard");
  }

  return (
    <PageShell centered>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
            Choose your username
          </h1>
          <p className="mt-2 text-sm text-secondary">
            This becomes your public blog URL.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </PageShell>
  );
}
