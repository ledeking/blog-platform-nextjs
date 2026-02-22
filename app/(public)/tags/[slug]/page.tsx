import { notFound } from "next/navigation";
import { getTagBySlug } from "@/actions/tags";
import { PostCard } from "@/components/blog/PostCard";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Tag: {tag.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tag.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
