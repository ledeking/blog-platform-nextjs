"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await createCategory(data);
      toast.success("Category created successfully!");
      reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={3} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}
