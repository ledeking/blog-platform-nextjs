import Link from "next/link";
import { getPosts } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminPostsPage() {
  const { posts } = await getPosts({ limit: 100, status: undefined });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Author</th>
              <th className="text-left p-4">Created</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b">
                <td className="p-4">{post.title}</td>
                <td className="p-4">
                  <span className="capitalize">{post.status.toLowerCase()}</span>
                </td>
                <td className="p-4">{post.author.name}</td>
                <td className="p-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
