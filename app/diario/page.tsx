"use client";

import EvolveShell, { DiaryContent } from "@/components/evolve-shell";

export default function DiarioPage() { return <EvolveShell active="Diario"><DiaryContent onAdd={() => undefined} /></EvolveShell>; }
