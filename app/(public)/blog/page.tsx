import { getPosts, getCategories } from "@/actions/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { posts, total, pages } = await getPosts({
    page,
    limit: 12,
    search: params.search,
  });
  const categories = await getCategories();

  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <h1 className="text-4xl font-bold mb-8">All Posts</h1>
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts found.</p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link href={`/blog?page=${page - 1}`}>
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}
                  {page < pages && (
                    <Link href={`/blog?page=${page + 1}`}>
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <aside>
          <div className="sticky top-20 space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
