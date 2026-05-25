import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardOverview } from "@/components/dashboard-overview";
import { PageShell } from "@/components/page-shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — Blog MCP",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const [postCount, topicCount] = await Promise.all([
    prisma.post.count({ where: { userId: user.id } }),
    prisma.topic.count({ where: { userId: user.id } }),
  ]);

  return (
    <PageShell wide>
      <DashboardHeader
        title="Dashboard"
        subtitle={
          <>
            @{user.username} ·{" "}
            <Link
              href={`/${user.username}`}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View public blog
            </Link>
          </>
        }
      />
      <DashboardNav />
      <DashboardOverview postCount={postCount} topicCount={topicCount} />
    </PageShell>
  );
}
