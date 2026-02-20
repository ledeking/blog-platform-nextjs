"use client";

import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface CategoryListProps {
  categories: Array<{ id: string; name: string; description: string | null }>;
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-2">
      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet.</p>
      ) : (
        categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <p className="font-medium">{category.name}</p>
              {category.description && (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(category.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
