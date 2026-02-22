import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCategories, getTags } from "@/actions/categories";
import { PostForm } from "@/components/admin/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      categories: true,
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  if (post.authorId !== user.id && user.role !== "ADMIN") {
    redirect("/admin/posts");
  }

  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
