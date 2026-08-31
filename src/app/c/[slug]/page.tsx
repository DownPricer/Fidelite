import { redirect } from "next/navigation";

export default async function MerchantPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/rejoindre/${slug}`);
}
