import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogArticles, getBlogArticle } from "@/data/blogArticles";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    return buildMetadata({
      title: "Article Not Found",
      description: "This article is no longer published. Browse our trekking guides and trail stories.",
      path: `/blogs/${slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    // `excerpt` over `standfirst`: the standfirst is a short display tagline,
    // often under 50 characters, which wastes most of the SERP snippet.
    description: article.excerpt ?? article.standfirst ?? "",
    path: `/blogs/${slug}`,
    image: article.image,
    type: "article",
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-14 sm:pb-32 space-y-8">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-brand-forest hover:text-brand-dusk-orange transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all articles</span>
      </Link>

      <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden relative shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <header className="space-y-3">
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="text-brand-forest bg-brand-forest/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-gray-400">{article.date}</span>
          {article.readMinutes && (
            <span className="text-gray-400">⏱️ {article.readMinutes} min read</span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-brand-dark-text leading-tight">
          {article.title}
        </h1>
        {article.standfirst && (
          <p className="text-sm text-gray-500 leading-relaxed font-medium">{article.standfirst}</p>
        )}
      </header>

      <article className="space-y-7">
        {article.sections.map((section, idx) => (
          <section key={idx} className="space-y-2.5">
            {section.heading && (
              <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">{section.heading}</h2>
            )}
            <div className="space-y-2 text-sm text-gray-650 leading-relaxed font-medium">
              {section.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {article.signoff && (
        <p className="text-sm font-extrabold text-brand-forest font-serif pt-6 border-t border-gray-100">
          {article.signoff}
        </p>
      )}

      {/* Stories written against a listing point back at it. */}
      {article.trekSlug && (
        <Link
          href={`/treks/${article.trekSlug}`}
          className="flex items-center justify-between gap-3 min-h-[44px] bg-brand-warm-bg/60 border border-gray-150 rounded-2xl px-5 py-4 hover:border-brand-forest/40 transition"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Read about the trek
            </span>
            <span className="block text-sm font-extrabold text-brand-dark-text font-serif truncate">
              {article.trekName ?? "View the trek page"}
            </span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0 text-brand-dusk-orange" />
        </Link>
      )}

      <div className="pt-4">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-brand-forest hover:text-brand-dusk-orange transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all articles</span>
        </Link>
      </div>
    </div>
  );
}
