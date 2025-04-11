"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSkillPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [level, setLevel] = useState<number>(1);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || level < 1 || level > 100 || !image) {
      setError(
        "Нэр, зураг болон түвшин заавал бөглөгдөх ёстой. Level 1-100 хооронд байна."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, level, image }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create skill");
      }

      router.push("/admin/skills");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white/5 text-white">
      <h1 className="text-2xl font-bold mb-4">Шинэ Skill нэмэх</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Нэр</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border bg-[#1e1e2a] text-white px-3 py-2 rounded"
            placeholder="Жишээ: React"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Level (1-100)</label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full border bg-[#1e1e2a] text-white px-3 py-2 rounded"
            placeholder="Жишээ: 90"
            min={1}
            max={100}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Зураг (URL)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border bg-[#1e1e2a] text-white px-3 py-2 rounded"
            placeholder="Жишээ: https://example.com/react.png"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Нэмэгдэж байна..." : "Нэмэх"}
        </button>
      </form>
    </div>
  );
}
