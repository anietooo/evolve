"use client";

import { ChangeEvent, startTransition, useEffect, useRef, useState } from "react";
import EvolveShell, { Header } from "@/components/evolve-shell";
import { ChevronDown, Images, Plus, Scale, Sparkles, Trash2, Upload } from "lucide-react";

type Photo = { id: string; date: string; month: string; image: string; weight: string; label?: string };

function getStoredPhotos(): Photo[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem("evolve-gallery") ?? "[]") as Photo[]; } catch { return []; }
}

export default function GaleriaPage() {
  const [mode, setMode] = useState<"Fotos" | "Comparar">("Fotos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const loaded = useRef(false);
  const [angle, setAngle] = useState("Frontal");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  useEffect(() => { if (loaded.current) window.localStorage.setItem("evolve-gallery", JSON.stringify(photos)); }, [photos]);
  useEffect(() => { startTransition(() => setPhotos(getStoredPhotos())); loaded.current = true; }, []);
  const addPhoto = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const date = new Date(); const newPhoto: Photo = { id: `photo-${Date.now()}`, month: date.toLocaleDateString("es-ES", { month: "long", year: "numeric" }), date: date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }).toUpperCase(), image: String(reader.result), weight: "Sin peso", label: "Nueva" }; setPhotos((currentPhotos) => [newPhoto, ...currentPhotos]); setSelectedIds((currentIds) => [newPhoto.id, ...currentIds].slice(0, 2)); }; reader.readAsDataURL(file); event.target.value = ""; };
  const removePhoto = (id: string) => { setPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== id)); setSelectedIds((currentIds) => currentIds.filter((selectedId) => selectedId !== id)); };
  const groupedMonths = Array.from(new Set(photos.map((photo) => photo.month)));

  return <EvolveShell active="Galería"><Header eyebrow="EVOLUCIÓN VISUAL" title="Tu galería" subtitle="Guarda tus fotos de progreso y compara tus cambios." action="Añadir foto" /><section className="gallery-hero"><div><p className="eyebrow">TU HISTORIAL</p><h2>{photos.length} <small>{photos.length === 1 ? "foto guardada" : "fotos guardadas"}</small></h2><p>{photos.length ? "Tu evolución, siempre contigo." : "Empieza subiendo tu primera foto."}</p></div><div className="gallery-hero-stat"><Images size={18} /><strong>{photos.length ? "Privado" : "Aún vacío"}</strong><small>Solo tú puedes verlo</small></div></section><div className="gallery-toolbar"><div className="gallery-tabs"><button className={mode === "Fotos" ? "selected" : ""} onClick={() => setMode("Fotos")}><Images size={14} /> Fotos</button><button className={mode === "Comparar" ? "selected" : ""} onClick={() => setMode("Comparar")}><Sparkles size={14} /> Comparar</button></div><label className="gallery-upload"><Upload size={14} /> Subir foto<input type="file" accept="image/*" onChange={addPhoto} /></label></div>{mode === "Fotos" ? <section className="gallery-months"><div className="gallery-intro"><div><p className="eyebrow">CRONOLOGÍA</p><h2>Tus fotos de progreso</h2></div><span>{photos.length ? "Ordenadas de más reciente a más antigua" : "Todavía no hay registros"}</span></div>{photos.length ? groupedMonths.map((month) => <div className="month-group" key={month}><h3>{month}</h3><div className="photo-grid">{photos.filter((photo) => photo.month === month).map((photo) => <article className="photo-card" key={photo.id}><div className="photo-image" style={{ backgroundImage: `url(${photo.image})` }}><span>{photo.date}</span>{photo.label && <b>{photo.label}</b>}</div><div className="photo-meta"><div><strong>{photo.weight}</strong><small><Scale size={10} /> Peso opcional</small></div><button aria-label={`Borrar foto del ${photo.date}`} onClick={() => removePhoto(photo.id)}><Trash2 size={14} /></button></div></article>)}</div></div>) : <div className="gallery-empty"><Images size={30} /><h3>Aquí aparecerá tu evolución</h3><p>Sube una foto para empezar a construir tu cronología.</p><label className="add-button"><Upload size={15} /> Subir mi primera foto<input type="file" accept="image/*" onChange={addPhoto} /></label></div>}</section> : <CompareView photos={photos} selectedIds={selectedIds} setSelectedIds={setSelectedIds} angle={angle} setAngle={setAngle} />}</EvolveShell>;
}

function CompareView({ photos, selectedIds, setSelectedIds, angle, setAngle }: { photos: Photo[]; selectedIds: string[]; setSelectedIds: (ids: string[]) => void; angle: string; setAngle: (angle: string) => void }) {
  const changePhoto = (index: number, id: string) => { const next = [...selectedIds]; next[index] = id; setSelectedIds(next); };
  if (photos.length < 2) return <section className="gallery-empty compare-empty"><Sparkles size={30} /><h3>Necesitas dos fotos para comparar</h3><p>Sube al menos dos momentos de tu evolución y aparecerán aquí.</p></section>;
  const before = photos.find((photo) => photo.id === selectedIds[0]) ?? photos[photos.length - 1]; const after = photos.find((photo) => photo.id === selectedIds[1]) ?? photos[0];
  return <section className="compare-view"><div className="compare-heading"><div><p className="eyebrow">COMPARACIÓN</p><h2>Antes y ahora</h2><p className="subtle">Elige dos fechas para ver tu evolución.</p></div><button className="save-button">Guardar comparación</button></div><div className="compare-selectors"><label><small>ANTES</small><select value={before.id} onChange={(event) => changePhoto(0, event.target.value)}>{photos.map((photo) => <option value={photo.id} key={photo.id}>{photo.date}</option>)}</select><ChevronDown size={13} /></label><span>VS</span><label><small>AHORA</small><select value={after.id} onChange={(event) => changePhoto(1, event.target.value)}>{photos.map((photo) => <option value={photo.id} key={photo.id}>{photo.date}</option>)}</select><ChevronDown size={13} /></label></div><div className="compare-photos"><div style={{ backgroundImage: `url(${before.image})` }}><span>{before.date}</span><b>{before.weight}</b></div><div style={{ backgroundImage: `url(${after.image})` }}><span>{after.date}</span><b>{after.weight}</b></div></div><div className="angle-tabs">{["Frontal", "Lateral", "Trasera"].map((item) => <button className={angle === item ? "selected" : ""} key={item} onClick={() => setAngle(item)}>{item}</button>)}</div><div className="compare-note"><Plus size={14} /><span>Selecciona fotos de distintos momentos para ver el cambio.</span></div></section>;
}
