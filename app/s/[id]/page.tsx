import { SessionShareClient } from "./SessionShareClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { id } = await params;
  return <SessionShareClient slug={id} />;
}
