"use client";

import { memo } from "react";
import type { Post } from "@/lib/types";

type Props = { posts: Post[] };

function PostListImpl({ posts }: Props) {
  if (!posts?.length) {
    return <p className="text-sm text-gray-500">No posts.</p>;
  }
  return (
    <ul className="space-y-2">
      {posts.map((p) => (
        <li key={p.id} className="border rounded p-3">
          <h3 className="font-medium">{p.title}</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{p.body}</p>
        </li>
      ))}
    </ul>
  );
}
const PostList = memo(PostListImpl);
export default PostList;
