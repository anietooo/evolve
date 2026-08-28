"use client";

import { useState } from "react";
import EvolveShell, { Header } from "@/components/evolve-shell";
import { Activity, ChevronLeft, ChevronRight, Flame, Scale } from "lucide-react";

const days = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return {
    day,
    kcal: day === 28 ? "1.464" : (1760 + (day * 37) % 390).toLocaleString("es-ES"),
    burned: (280 + (day * 41) % 260).toString(),
    weight: (75.4 + (30 - day) * 0.04).toFixed(1).replace(".", ","),
  };
});

export default function DiarioPage() {
  const [selectedDay, setSelectedDay] = useState(28);
  const selected = days.find((day) => day.day === selectedDay) ?? days[27];
  const selectedDate = new Date(2026, 7, selected.day);
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(selectedDate);

  return (
    <EvolveShell active="Diario">
      <Header eyebrow="DIARIO · AGOSTO 2026" title="Tu calendario" subtitle="Consulta tus comidas, actividad y evolución día a día." action="Añadir registro" />
      <div className="diary-calendar-toolbar">
        <button aria-label="Mes anterior"><ChevronLeft size={14} /></button>
        <strong>Agosto 2026</strong>
        <button aria-label="Mes siguiente"><ChevronRight size={14} /></button>
        <span className="calendar-view-label">Vista mensual</span>
      </div>
      <section className="calendar-layout">
        <div className="calendar-card">
          <div className="calendar-weekdays">{["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">{Array.from({ length: 5 }, (_, index) => <span className="calendar-empty" key={`empty-${index}`} />)}{days.map((day) => <button className={`calendar-day ${day.day === selectedDay ? "selected" : ""}`} onClick={() => setSelectedDay(day.day)} key={day.day}><b>{day.day}</b><small><Flame size={10} /> {day.kcal}</small><small><Activity size={10} /> {day.burned} kcal</small><em><Scale size={9} /> {day.weight} kg</em></button>)}</div>
          <div className="calendar-legend"><span><i className="legend-dot complete" /> Día registrado</span><span><i className="legend-dot today-dot" /> Seleccionado</span><span><i className="legend-dot empty-dot" /> Sin datos</span></div>
        </div>
        <aside className="selected-day-panel">
          <p className="eyebrow">DETALLE DEL DÍA</p>
          <h2>{weekday} {selected.day} de agosto de 2026</h2>
          <div className="day-total"><span>Calorías consumidas</span><strong>{selected.kcal} <small>/ 2.200 kcal</small></strong><div className="bar"><i style={{ width: `${Math.min(Number(selected.kcal.replace(".", "")) / 22, 100)}%` }} /></div></div>
          <div className="selected-stats"><div><Flame size={15} /><span>Gastadas<strong>{selected.burned} kcal</strong></span></div><div><Scale size={15} /><span>Peso<strong>{selected.weight} kg</strong></span></div></div>
        </aside>
      </section>
    </EvolveShell>
  );
}
