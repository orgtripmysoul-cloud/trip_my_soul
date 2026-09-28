import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getPolicyPage } from "@/data/policies";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicyPage(slug);

  if (!policy) {
    return buildMetadata({
      title: "Policy Not Found",
      description: "This policy page does not exist. See our booking, cancellation and privacy policies.",
      path: `/policies/${slug}`,
    });
  }

  return buildMetadata({
    title: policy.title,
    description: policy.subtitle,
    path: `/policies/${slug}`,
  });
}

export default function PolicyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
