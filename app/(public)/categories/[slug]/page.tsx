import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/actions/categories";
import { PostCard } from "@/components/blog/PostCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mb-8">{category.description}</p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
