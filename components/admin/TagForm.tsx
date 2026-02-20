"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTag } from "@/actions/tags";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type TagFormData = z.infer<typeof tagSchema>;

export function TagForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
  });

  const onSubmit = async (data: TagFormData) => {
    setIsSubmitting(true);
    try {
      await createTag(data);
      toast.success("Tag created successfully!");
      reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create tag");
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Tag"}
      </Button>
    </form>
  );
}
