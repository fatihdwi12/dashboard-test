export type Address = {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
  geo?: { lat?: string; lng?: string };
};

export type Company = {
  name?: string;
  catchPhrase?: string;
  bs?: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
  address?: { street?: string; city?: string };
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// src/lib/types.ts
export type APIUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
  address?: { street?: string; city?: string };
};
export type APIPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// ⬇⬇⬇ Tambahkan ini
export type ListResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; pages: number };
};
