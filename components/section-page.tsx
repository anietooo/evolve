import EvolveShell, { Header, Panel } from "@/components/evolve-shell";

export default function SectionPage({ active, eyebrow, title, subtitle }: { active: string; eyebrow: string; title: string; subtitle: string }) { return <EvolveShell active={active}><Header eyebrow={eyebrow} title={title} subtitle={subtitle} action="Añadir registro" /><Panel title="Próximamente"><p className="subtle">Estamos preparando esta sección para que puedas seguir tu evolución desde un solo lugar.</p></Panel></EvolveShell>; }
