"use client";

import { Button } from "@/components/ui/button";
import { deleteTag } from "@/actions/tags";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface TagListProps {
  tags: Array<{ id: string; name: string }>;
}

export function TagList({ tags }: TagListProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    try {
      await deleteTag(id);
      toast.success("Tag deleted successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tag");
    }
  };

  return (
    <div className="space-y-2">
      {tags.length === 0 ? (
        <p className="text-muted-foreground">No tags yet.</p>
      ) : (
        tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <p className="font-medium">{tag.name}</p>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(tag.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
