import { getCategories } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryList } from "@/components/admin/CategoryList";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Categories</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
          <CategoryForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Categories</h2>
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
}
