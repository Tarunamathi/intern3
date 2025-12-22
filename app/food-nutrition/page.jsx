"use client";
import { useEffect, useState, useCallback } from "react";

export default function FoodNutritionPage() {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const manifestPath = "/docs/food-nutrition/manifest.json";

  useEffect(() => {
    fetch(manifestPath)
      .then((r) => r.json())
      .then((j) => setFiles(Array.isArray(j.files) ? j.files : []))
      .catch(() => setFiles([]));
  }, []);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, files.length - 1)), [files.length]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = files[index];

  return (
    <main style={{ padding: 24 }}>
      <h2>Food & Nutrition — Documents</h2>
      {files.length === 0 ? (
        <p>No PDFs found. Add files to <code>/public/docs/food-nutrition</code> and update <code>manifest.json</code>.</p>
      ) : (
        <div>
          <div style={{ margin: "12px 0", display: "flex", gap: 8 }}>
            <button onClick={prev} disabled={index === 0}>Previous</button>
            <button onClick={next} disabled={index >= files.length - 1}>Next</button>
            <a href={`/docs/food-nutrition/${current}`} target="_blank" rel="noopener" style={{ marginLeft: 12 }}>Open in new tab</a>
            <a href={`/docs/food-nutrition/${current}`} download style={{ marginLeft: 8 }}>Download</a>
          </div>

          <div style={{ border: "1px solid #ddd", height: "80vh" }}>
            <iframe
              src={`/docs/food-nutrition/${current}`}
              title={current}
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </div>

          <p style={{ marginTop: 8 }}>{index + 1} of {files.length}: {current}</p>
        </div>
      )}
    </main>
  );
}
