/**
 * The policy pages served by `/policies/[slug]`.
 *
 * Only the routing and SEO surface lives here — the long-form copy stays in
 * that page's switch, which is a client component. This exists so the sitemap
 * and the route's metadata read one list instead of each keeping their own.
 * Adding a policy means a case there and an entry here.
 */
export interface PolicyPage {
  slug: string;
  title: string;
  /** Mirrors the page's own subtitle; doubles as the meta description. */
  subtitle: string;
}

export const POLICY_PAGES: PolicyPage[] = [
  {
    slug: "payment-policy",
    title: "Payment & Booking Policy",
    subtitle: "Terms regarding reservation amounts, balances, and payment gateways.",
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation & Voucher Policy",
    subtitle: "Rules regarding slot changes, cancellations, and trail cancellations.",
  },
  {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    subtitle: "Rules of conduct, medical declarations, and trip disruptions.",
  },
  {
    slug: "privacy-policy",
    title: "Privacy & Data Protection",
    subtitle: "How we secure your personal, payment, and health data.",
  },
];

export function getPolicyPage(slug: string): PolicyPage | undefined {
  return POLICY_PAGES.find((p) => p.slug === slug);
}
