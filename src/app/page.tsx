"use client";
import { useEffect, useRef, useState } from "react";

const W = 1080, H = 1350;
const DEFAULT = "FOR THE FOREST\nFOR THE ANIMALS\nFOR THE PEOPLE";
export default function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [words, setWords] = useState(DEFAULT);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(84);
  const [opacity, setOpacity] = useState(45);
  const [position, setPosition] = useState(50);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ["#19AD72", "#152BB9", "#D70020"].forEach((color, i) => {
      ctx.fillStyle = color; ctx.fillRect(i * W / 3, 0, W / 3 + 1, H);
    });
    if (photo) {
      const ratio = Math.max(W / photo.width, H / photo.height);
      const dw = photo.width * ratio, dh = photo.height * ratio;
      ctx.save(); ctx.globalAlpha = opacity / 100;
      ctx.drawImage(photo, (W - dw) / 2, (H - dh) / 2, dw, dh);
      ctx.restore();
    }
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${scale}px Arial, Helvetica, sans-serif`;
    const lines = words.toUpperCase().split("\n").flatMap(line => {
      const result: string[] = [], parts = line.split(/\s+/); let current = "";
      for (const part of parts) {
        const trial = current ? current + " " + part : part;
        if (ctx.measureText(trial).width > W - 115 && current) { result.push(current); current = part; }
        else current = trial;
      }
      result.push(current); return result;
    });
    const step = scale * 1.18, total = lines.length * step;
    const start = (H - total) * position / 100 + step / 2;
    lines.forEach((line, i) => ctx.fillText(line, 58, start + i * step, W - 116));
  }, [words, photo, scale, opacity, position]);
  function upload(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { setPhoto(img); URL.revokeObjectURL(url); setBusy(false); };
    img.onerror = () => { URL.revokeObjectURL(url); setBusy(false); };
    img.src = url;
  }
  function save() {
    const link = document.createElement("a");
    link.download = "suara-bumi-poster.png";
    link.href = canvas.current!.toDataURL("image/png");
    link.click();
  }
  return (
    <main className="min-h-screen bg-[#101010] text-white">
      <header className="flex items-center justify-between border-b border-white/15 px-6 py-5 md:px-12">
        <a href="/" className="text-xl font-black tracking-tight">SUARA BUMI<span className="text-[#1BAF75]">.</span></a>
        <span className="text-xs uppercase tracking-[.2em] text-white/50">For the forest · animals · people</span>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[.85fr_1.15fr] lg:px-12">
        <section>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.25em] text-[#1BAF75]">A canvas for change</p>
          <h1 className="mb-6 text-5xl font-black leading-[.98] tracking-[-.06em] md:text-7xl">BERSUARA.<br/>UNTUK BUMI.</h1>
          <p className="mb-10 max-w-md text-base leading-relaxed text-white/60">Buat poster solidaritas untuk hutan, satwa, dan manusia. Diproses langsung di browser. Tanpa akun, tanpa upload ke server, tanpa menyimpan data.</p>
          <div className="space-y-6 rounded-2xl border border-white/15 bg-white/[.04] p-6">
            <div><label className="mb-2 block text-sm font-semibold">01 / Foto (opsional)</label>
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/30 px-5 py-8 text-center text-sm text-white/70 transition hover:border-white hover:text-white">
                {busy ? "Memproses..." : photo ? "Ganti foto" : "Klik untuk memilih foto dari perangkat"}
                <input aria-label="Upload foto" type="file" accept="image/*" className="hidden" onChange={e => upload(e.target.files?.[0])}/>
              </label>
              {photo && <button onClick={() => setPhoto(null)} className="mt-2 text-xs text-white/50 underline">Hapus foto</button>}
            </div>
            <div><label htmlFor="statement" className="mb-2 block text-sm font-semibold">02 / Pesan postermu</label>
              <textarea id="statement" value={words} onChange={e => setWords(e.target.value)} rows={4} maxLength={240} className="w-full resize-y rounded-xl border border-white/20 bg-black/30 p-4 text-sm font-bold uppercase outline-none focus:border-[#1BAF75]"/></div>
            <div><label htmlFor="size" className="mb-2 block text-sm font-semibold">Ukuran teks · {scale}px</label>
              <input id="size" type="range" min="44" max="120" value={scale} onChange={e => setScale(+e.target.value)} className="w-full accent-[#1BAF75]"/></div>
            <div><label htmlFor="place" className="mb-2 block text-sm font-semibold">Posisi vertikal · {position}%</label>
              <input id="place" type="range" min="0" max="100" value={position} onChange={e => setPosition(+e.target.value)} className="w-full accent-[#1BAF75]"/></div>
            {photo && <div><label htmlFor="opacity" className="mb-2 block text-sm font-semibold">Opasitas foto · {opacity}%</label>
              <input id="opacity" type="range" min="0" max="100" value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full accent-[#1BAF75]"/></div>}
            <button onClick={save} className="w-full rounded-xl bg-white px-6 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#1BAF75] hover:text-white">Simpan poster PNG ↓</button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-white/40">Privasi by design: gambar hanya diproses secara lokal di browser. Tidak ada database, akun, atau endpoint upload.</p>
        </section>
        <section className="flex flex-col items-center justify-start">
          <div className="mb-3 flex w-full max-w-[520px] items-center justify-between text-xs uppercase tracking-[.2em] text-white/40"><span>Live preview</span><span>1080 × 1350 px</span></div>
          <canvas ref={canvas} width={W} height={H} aria-label="Preview poster tiga warna" className="w-full max-w-[520px] shadow-[0_25px_75px_rgba(0,0,0,.5)]"/>
          <p className="mt-5 text-center text-xs text-white/40">Untuk hutan. Untuk satwa. Untuk manusia.</p>
        </section>
      </div>
    </main>
  );
}