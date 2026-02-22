import { getPosts } from "@/actions/posts";
import { getCategories } from "@/actions/categories";
import { PostCard } from "@/components/blog/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
  const { posts: featuredPosts } = await getPosts({ limit: 6 });
  const { posts: latestPosts } = await getPosts({ limit: 6, page: 1 });
  const categories = await getCategories();

  return (
    <div className="container py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing articles, tutorials, and insights on technology,
          development, and more.
        </p>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Latest Posts */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog">
              <button className="text-primary hover:underline">
                View All Posts →
              </button>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Badge variant="secondary" className="cursor-pointer">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to get the latest posts delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
              />
              <button className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Subscribe
              </button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
