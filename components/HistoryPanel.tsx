"use client";

import { Clock3, Download, Trash2 } from "lucide-react";

export type HistoryItem = {
  id: string;
  imageUrl: string;
  createdAt: string;
  mannequin: string;
  background: string;
};

export default function HistoryPanel({
  items,
  onDelete,
}: {
  items: HistoryItem[];
  onDelete: (id: string) => void;
}) {
  if (!items.length) {
    return <div className="empty-history"><Clock3 size={30} /><h3>No creations yet</h3><p>Your generated mockups will appear here.</p></div>;
  }

  return (
    <div className="history-grid">
      {items.map((item) => (
        <article className="history-card" key={item.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt="Generated fashion mockup" />
          <div className="history-meta">
            <div><strong>{item.mannequin} mannequin</strong><span>{new Date(item.createdAt).toLocaleString()}</span></div>
            <div className="history-actions">
              <a href={item.imageUrl} target="_blank" rel="noreferrer" aria-label="Open image"><Download size={17} /></a>
              <button onClick={() => onDelete(item.id)} aria-label="Delete history item"><Trash2 size={17} /></button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
