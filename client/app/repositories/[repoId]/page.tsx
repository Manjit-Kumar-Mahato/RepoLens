import { use } from "react";

import { RepoDashboard } from "@/components/repositories/repo-dashboard";
import { RequireAuth } from "@/components/providers/require-auth";

type RepositoryPageProps = {
  params: Promise<{
    repoId: string;
  }>;
};

export default function RepositoryPage({
  params,
}: RepositoryPageProps) {
  const { repoId } = use(params);

  return (
    <RequireAuth>
      <RepoDashboard repoId={repoId} />
    </RequireAuth>
  );
}