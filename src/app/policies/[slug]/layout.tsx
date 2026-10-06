import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { getPolicyPage } from "@/data/policies";
import { buildMetadata, noIndexMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicyPage(slug);

  if (!policy) {
    // The layout 404s this path, so these tags exist only for the error
    // response — `noindex` keeps that body out of the index.
    return noIndexMetadata(
      "Policy Not Found",
      "This policy page does not exist. See our booking, cancellation and privacy policies.",
    );
  }

  return buildMetadata({
    title: policy.title,
    description: policy.subtitle,
    path: `/policies/${slug}`,
  });
}

export default async function PolicyLayout({
  children,
  params,
}: { children: ReactNode } & Params) {
  const { slug } = await params;

  // Unknown slugs used to render "Policy Page Not Found" with HTTP 200 — a soft
  // 404. The page is a client component, so the status has to be set here.
  if (!getPolicyPage(slug)) {
    notFound();
  }

  return <>{children}</>;
}
