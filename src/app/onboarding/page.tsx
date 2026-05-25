import { OnboardingForm } from "@/components/onboarding-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Choose username — Blog MCP",
};

/**
 * Onboarding page: user picks a unique username before using the dashboard.
 */
export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.username) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Choose your username
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This will be your public blog URL path later.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
