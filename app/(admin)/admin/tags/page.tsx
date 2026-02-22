import { getTags } from "@/actions/tags";
import { TagForm } from "@/components/admin/TagForm";
import { TagList } from "@/components/admin/TagList";

export default async function AdminTagsPage() {
  const tags = await getTags();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Tags</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create Tag</h2>
          <TagForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Tags</h2>
          <TagList tags={tags} />
        </div>
      </div>
    </div>
  );
}
