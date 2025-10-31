"use client";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";

type Props = { onChange: (v: string) => void };
export default function SearchBar({ onChange }: Props) {
  const [val, setVal] = useState("");
  const debounced = useMemo(() => debounce(onChange, 250), [onChange]);
  return (
    <input
      className="w-full md:w-80 px-3 py-2 rounded-xl border dark:bg-gray-900"
      placeholder="Search by name, email, username"
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
        debounced(e.target.value);
      }}
    />
  );
}
