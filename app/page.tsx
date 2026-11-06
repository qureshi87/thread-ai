"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, Check, ChevronDown, ImagePlus, LoaderCircle, RefreshCw, ShieldCheck, Sparkles, UploadCloud, WandSparkles } from "lucide-react";
import HistoryPanel, { type HistoryItem } from "@/components/HistoryPanel";

type Mannequin = "male" | "female" | "ghost";
type Background = "white" | "grey" | "luxury";
const HISTORY_KEY = "thread-ai-history-v1";

export default function Home() {
  const [tab, setTab] = useState<"studio" | "history">("studio");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mannequin, setMannequin] = useState<Mannequin>("female");
  const [background, setBackground] = useState<Background>("white");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")); } catch { setHistory([]); }
  }, []);

  function saveHistory(items: HistoryItem[]) {
    setHistory(items);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(items)); } catch { /* browser storage may be full */ }
  }

  function selectFile(next: File | undefined) {
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) { setError("Please select a JPG, PNG or WEBP image."); return; }
    if (next.size > 4 * 1024 * 1024) { setError("Image must be 4 MB or smaller."); return; }
    setError("");
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setResult("");
  }

  async function generate() {
    if (!file) { setError("First upload a garment photo."); return; }
    setLoading(true); setError(""); setResult("");
    try {
      const body = new FormData();
      body.append("image", file);
      body.append("mannequin", mannequin);
      body.append("background", background);
      const response = await fetch("/api/generate", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setResult(data.imageUrl);
      const item: HistoryItem = { id: crypto.randomUUID(), imageUrl: data.imageUrl, createdAt: new Date().toISOString(), mannequin, background };
      saveHistory([item, ...history].slice(0, 20));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  function removeHistory(id: string) { saveHistory(history.filter((item) => item.id !== id)); }

  async function downloadResult() {
    if (!result) return;
    try {
      const response = await fetch(result);
      if (!response.ok) throw new Error("Download unavailable");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "thread-ai-fashion-mockup.png"; link.click();
      URL.revokeObjectURL(url);
    } catch { window.open(result, "_blank", "noopener,noreferrer"); }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">T</span><span>THREAD<span className="gold"> AI</span><small>FASHION MOCKUP STUDIO</small></span></a>
        <div className="topbar-right"><span className="status-dot" /> AI STUDIO <span className="version">BETA</span></div>
      </header>

      <section className="hero">
        <div className="eyebrow"><Sparkles size={14} /> YOUR GARMENT. REIMAGINED.</div>
        <h1>Fashion, in its <em>best form.</em></h1>
        <p>Turn a simple garment photo into a professional fashion campaign image. Keep the details that make your design yours.</p>
      </section>

      <nav className="tabs">
        <button className={tab === "studio" ? "active" : ""} onClick={() => setTab("studio")}><WandSparkles size={16} /> Studio</button>
        <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Creation history <span className="count">{history.length}</span></button>
      </nav>

      {tab === "studio" ? (
        <section className="workspace">
          <div className="controls-column">
            <div className="section-heading"><span>01</span><div><h2>Upload your garment</h2><p>Start with a clear product photograph.</p></div></div>
            <button className={`upload-box ${preview ? "has-image" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); selectFile(e.dataTransfer.files[0]); }}>
              {preview ? <><img src={preview} alt="Garment preview" /><span className="change-image"><RefreshCw size={14} /> Change image</span></> : <><span className="upload-icon"><UploadCloud size={24} /></span><strong>Drop your garment photo here</strong><span>or click to browse files</span><small>JPG, PNG or WEBP · Maximum 4 MB</small></>}
            </button>
            <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => selectFile(e.target.files?.[0])} />

            <div className="section-heading second"><span>02</span><div><h2>Choose your presentation</h2><p>Select how your garment should appear.</p></div></div>
            <div className="choice-grid">
              {(["female", "male", "ghost"] as Mannequin[]).map((item) => (
                <button key={item} className={`choice ${mannequin === item ? "selected" : ""}`} onClick={() => setMannequin(item)}>
                  <span className={`choice-art ${item}`}>{item === "ghost" ? "◇" : item === "male" ? "M" : "F"}</span><strong>{item === "ghost" ? "Ghost mannequin" : `${item[0].toUpperCase()}${item.slice(1)} model`}</strong>{mannequin === item && <Check className="choice-check" size={15} />}
                </button>
              ))}
            </div>

            <div className="field-label">BACKGROUND <span>Choose a studio look</span></div>
            <div className="background-options">
              {([{id:"white",label:"Clean white"},{id:"grey",label:"Soft grey"},{id:"luxury",label:"Luxury studio"}] as {id:Background;label:string}[]).map((item) => <button key={item.id} className={background === item.id ? "bg-option selected" : "bg-option"} onClick={() => setBackground(item.id)}><span className={`swatch ${item.id}`} />{item.label}</button>)}
            </div>

            <div className="preserve-note"><ShieldCheck size={18} /><div><strong>Garment preservation priority</strong><p>AI is instructed to preserve original colours, logos, prints, stitching and garment construction. Always review the result before commercial use.</p></div></div>
            {error && <div className="error-message">{error}</div>}
            <button className="generate-button" disabled={loading || !file} onClick={generate}>{loading ? <><LoaderCircle className="spin" size={18} /> Creating your mockup...</> : <><Sparkles size={18} /> Generate fashion mockup <span>→</span></>}</button>
            <p className="powered">AI generation uses Replicate. API usage may incur charges.</p>
          </div>

          <div className="preview-column">
            <div className="preview-heading"><div><span className="field-label">LIVE PREVIEW</span><h2>Your creative canvas</h2></div><span className="preview-status">{result ? "COMPLETE" : loading ? "GENERATING" : "READY"}</span></div>
            <div className="result-canvas">
              {result ? <img className="result-image" src={result} alt="Generated fashion mockup" /> : loading ? <div className="generating"><div className="loader-ring" /><h3>Crafting your look</h3><p>Creating a professional fashion image. This may take a minute or two.</p></div> : <div className="canvas-placeholder"><div className="placeholder-symbol"><ImagePlus size={32} /></div><h3>Your result will appear here</h3><p>Upload a garment photo and choose your presentation to begin.</p><div className="placeholder-tags"><span>PHOTO REALISTIC</span><span>DETAIL FOCUSED</span><span>STUDIO QUALITY</span></div></div>}
            </div>
            {result && <button className="download-button" onClick={downloadResult}><ArrowDownToLine size={17} /> Download high-resolution image</button>}
            <div className="preview-footer"><span><span className="tiny-dot" /> Secure generation</span><span>THREAD AI STUDIO</span></div>
          </div>
        </section>
      ) : <section className="history-section"><div className="history-title"><div><span className="field-label">YOUR WORKSPACE</span><h2>Creation history</h2></div><span>{history.length} / 20 saved in this browser</span></div><HistoryPanel items={history} onDelete={removeHistory} /><p className="history-disclaimer">History is stored in this browser only. Generated image links may expire; download important results to keep them permanently.</p></section>}

      <footer className="footer"><span>© 2026 THREAD AI</span><span>MADE FOR THE DETAILS THAT MATTER.</span></footer>
    </main>
  );
}
