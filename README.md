# Dashboard Users — Next.js 16 (App Router)

Fitur utama:

- Auth JWT (username: `testuser`, password: `testpass`) via API Route + middleware proteksi `/dashboard` & `/users/*`.
- Dashboard daftar user (sort, search, pagination) — data dari JSONPlaceholder, dengan **override edit** agar perubahan terlihat di list & detail.
- Halaman detail `/users/[id]` + daftar posts user.
- Edit user (React Hook Form + Zod) dengan validasi front-end & sanitasi di server.
- Caching modern: tag-based (`next: { tags: [...] }`) + invalidasi `revalidateTag("users", "max")`.
- TypeScript **strict** (tanpa `any`) + skema tipe terpusat.

## Getting Started

```bash
npm i
npm run dev
```
