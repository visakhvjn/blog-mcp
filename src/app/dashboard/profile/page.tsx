import { ProfileSummaryForm } from "@/components/profile-summary-form";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { PageShell } from "@/components/page-shell";
import { BRAND_NAME } from "@/lib/brand";
import { requireUser } from "@/lib/require-user";
import { getUserProfile } from "@/services/user-service";
import Link from "next/link";

export const metadata = {
  title: `Profile — ${BRAND_NAME}`,
};

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getUserProfile(user.id);

  return (
    <PageShell wide>
      <DashboardHeader
        title="Profile"
        subtitle={
          <>
            Public page:{" "}
            <Link
              href={`/${user.username}`}
              className="link font-mono"
              target="_blank"
              rel="noopener noreferrer"
            >
              /{user.username}
            </Link>
          </>
        }
      />
      <DashboardNav />

      <ProfileSummaryForm summary={profile?.summary ?? null} />
    </PageShell>
  );
}
