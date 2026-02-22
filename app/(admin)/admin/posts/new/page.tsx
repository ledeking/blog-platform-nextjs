import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCategories, getTags } from "@/actions/categories";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  await requireAdmin();
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <PostForm categories={categories} tags={tags} />
    </div>
  );
}
