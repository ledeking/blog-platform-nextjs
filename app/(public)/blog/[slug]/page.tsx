import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/actions/posts";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: post.canonicalUrl || `/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts
  const { posts: relatedPosts } = await getPosts({ limit: 3 });

  return (
    <article className="container py-12 max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {post.categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {post.author.imageUrl && (
              <Image
                src={post.author.imageUrl}
                alt={post.author.name || ""}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
          {post.publishedAt && (
            <>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
            </>
          )}
          {post.readingTime && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>

      {post.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-sm font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                </a>
              ))}
          </div>
        </div>
      )}
    </article>
  );
}
