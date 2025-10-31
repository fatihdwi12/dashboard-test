"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-4">
      <h2 className="text-red-600 font-semibold mb-2">Something went wrong</h2>
      <pre className="text-xs bg-red-50 border p-2 rounded">
        {error.message}
      </pre>
    </div>
  );
}
