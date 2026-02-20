"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPost, updatePost } from "@/actions/posts";
import { toast } from "sonner";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishAt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  categoryIds: z.array(z.string()),
  tagIds: z.array(z.string()),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: any;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

export function PostForm({ post, categories, tags }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          coverImage: post.coverImage || "",
          status: post.status,
          publishAt: post.publishAt
            ? new Date(post.publishAt).toISOString().slice(0, 16)
            : "",
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          canonicalUrl: post.canonicalUrl || "",
          categoryIds: post.categories.map((c: any) => c.id),
          tagIds: post.tags.map((t: any) => t.id),
        }
      : {
          status: "DRAFT",
          categoryIds: [],
          tagIds: [],
        },
  });

  const selectedCategories = watch("categoryIds");
  const selectedTags = watch("tagIds");

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      if (post) {
        await updatePost(post.id, data);
        toast.success("Post updated successfully!");
      } else {
        await createPost(data);
        toast.success("Post created successfully!");
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories || [];
    if (current.includes(categoryId)) {
      setValue(
        "categoryIds",
        current.filter((id) => id !== categoryId)
      );
    } else {
      setValue("categoryIds", [...current, categoryId]);
    }
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTags || [];
    if (current.includes(tagId)) {
      setValue("tagIds", current.filter((id) => id !== tagId));
    } else {
      setValue("tagIds", [...current, tagId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register("excerpt")} rows={3} />
      </div>

      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          {...register("content")}
          rows={20}
          className="font-mono text-sm"
        />
        {errors.content && (
          <p className="text-sm text-destructive mt-1">
            {errors.content.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="coverImage">Cover Image URL</Label>
        <Input id="coverImage" {...register("coverImage")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(value: any) => setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {watch("status") === "SCHEDULED" && (
          <div>
            <Label htmlFor="publishAt">Publish At</Label>
            <Input
              id="publishAt"
              type="datetime-local"
              {...register("publishAt")}
            />
          </div>
        )}
      </div>

      <div>
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`px-3 py-1 rounded-md text-sm border ${
                selectedCategories?.includes(category.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-md text-sm border ${
                selectedTags?.includes(tag.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="metaTitle">SEO: Meta Title</Label>
        <Input id="metaTitle" {...register("metaTitle")} />
      </div>

      <div>
        <Label htmlFor="metaDescription">SEO: Meta Description</Label>
        <Textarea id="metaDescription" {...register("metaDescription")} rows={2} />
      </div>

      <div>
        <Label htmlFor="canonicalUrl">Canonical URL</Label>
        <Input id="canonicalUrl" {...register("canonicalUrl")} />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
