import { notFound } from "next/navigation";
import Image from "next/image";
import { blogs } from "@/lib/blogs";


type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = blogs.find((post) => post.slug === slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  const siteUrl = "https://www.khaturidescg.in";
  const postUrl = `${siteUrl}/blog/${blog.slug}`;

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.keywords,
    authors: [{ name: blog.author }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: postUrl,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.image],
    },
  };
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = blogs.find((post) => post.slug === slug);

  if (!blog) {
    notFound();
  }

  const siteUrl = "https://www.khaturidescg.in";
  const postUrl = `${siteUrl}/blog/${blog.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    image: blog.image,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Organization",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Khatu Rides Travels Co.",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    url: postUrl,
    articleSection: blog.category,
    keywords: blog.keywords.join(", "),
  };

  const faqSchema = blog.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blog.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <main className="bg-white text-gray-900">
        <article className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:px-8">
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                {blog.category}
              </span>
              {blog.featured && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Featured
                </span>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
              {blog.title}
            </h1>

            <p className="mb-6 max-w-3xl text-lg leading-8 text-gray-600">
              {blog.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 border-y border-gray-200 py-4 text-sm text-gray-600">
              <span>
                <strong>Author:</strong> {blog.author}
              </span>
              <span>
                <strong>Published:</strong> {formatDate(blog.publishedAt)}
              </span>
              <span>
                <strong>Updated:</strong> {formatDate(blog.updatedAt)}
              </span>
              <span>
                <strong>Read Time:</strong> {blog.readTime}
              </span>
            </div>
          </header>

          <div className="mb-10 overflow-hidden rounded-2xl">
            <Image
              src={blog.image}
              alt={blog.title}
              width={1200}
              height={700}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <section className="mb-10 rounded-2xl bg-orange-50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Quick Overview
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>• Distance: Approx. 210 km</li>
              <li>• Travel Time: Around 4.5 to 5 hours</li>
              <li>• One-Way Taxi Available</li>
              <li>• Airport Pickup & Drop Available</li>
              <li>• Sedan Fare: ₹2800 onwards</li>
              <li>• Ertiga Fare: ₹3200 onwards</li>
              <li>• Innova Crysta Fare: ₹4500 onwards</li>
            </ul>
          </section>

          <section className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            {blog.content.split("\n").map((line, index) => {
              const trimmed = line.trim();

              if (!trimmed) {
                return <div key={index} className="h-2" />;
              }

              if (trimmed === "---") {
                return <hr key={index} className="my-8 border-gray-200" />;
              }

              if (trimmed.startsWith("# ")) {
                return (
                  <h1 key={index} className="mt-10 mb-4 text-3xl font-bold">
                    {trimmed.replace("# ", "")}
                  </h1>
                );
              }

              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={index} className="mt-10 mb-4 text-2xl font-bold">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={index} className="mt-8 mb-3 text-xl font-semibold">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("- ")) {
                return (
                  <ul key={index} className="my-2 ml-5 list-disc">
                    <li>{trimmed.replace("- ", "")}</li>
                  </ul>
                );
              }

              return (
                <p key={index} className="mb-4 leading-8 text-gray-700">
                  {trimmed}
                </p>
              );
            })}
          </section>

          {blog.faq && blog.faq.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {blog.faq.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {item.question}
                    </h3>
                    <p className="leading-7 text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14 rounded-2xl bg-gray-900 p-6 text-white">
            <h2 className="mb-4 text-2xl font-bold">Book Your Taxi Now</h2>
            <p className="mb-4 text-gray-200">
              Khatu Rides Travels Co. provides one-way taxi, round-trip taxi,
              airport transfer, and corporate cab booking services across
              Chhattisgarh.
            </p>
            <div className="space-y-2 text-sm md:text-base">
              <p>
                <strong>Call:</strong> +91 9244137353
              </p>
              <p>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/919244137353"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-300 underline"
                >
                  https://wa.me/919244137353
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.khaturidescg.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-300 underline"
                >
                  https://www.khaturidescg.in
                </a>
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}