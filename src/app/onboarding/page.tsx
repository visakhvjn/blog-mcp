import { OnboardingForm } from "@/components/onboarding-form";
import { PageShell } from "@/components/page-shell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Choose username — Blog MCP",
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
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
