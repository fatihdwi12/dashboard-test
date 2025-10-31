// src/components/users/EditUserForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

// ──────────────────────────────
//  Schema Zod untuk validasi
// ──────────────────────────────
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  website: z.string().optional(),
  company: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditUserForm({
  user,
  onUpdated,
}: {
  user: User;
  onUpdated: (u: User) => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      company: { name: user.company?.name },
      address: { street: user.address?.street, city: user.address?.city },
    },
  });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update");
      }
      const updated = await res.json();
      onUpdated(updated);
      router.refresh(); // pastikan data global refresh
    } catch (e: any) {
      setError(e.message || "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.name && (
          <p className="text-red-600 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          {...register("username")}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.username && (
          <p className="text-red-600 text-xs">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email")}
          type="email"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.email && (
          <p className="text-red-600 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          {...register("phone")}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Website</label>
        <input
          {...register("website")}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Company</label>
        <input
          {...register("company.name")}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Street</label>
          <input
            {...register("address.street")}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            {...register("address.city")}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded px-4 py-2 border bg-indigo-600 text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
