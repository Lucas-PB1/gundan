import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createEmptyPilotSheet,
  migratePilot,
  type PilotSheet,
} from '../domain/entities/PilotSheet';

import { parsePilotImportJson } from './export/pilotImportExport';

const STORAGE_KEY = 'beam-saber-pilots';
const ACTIVE_KEY = 'beam-saber-active-pilot';

function loadRaw(): PilotSheet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<PilotSheet> & { id: string }>;
    return parsed.map(migratePilot);
  } catch {
    return [];
  }
}

function persist(pilots: PilotSheet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pilots));
}

export function usePilotStorage() {
  const [pilots, setPilots] = useState<PilotSheet[]>(() => loadRaw());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const saved = localStorage.getItem(ACTIVE_KEY);
    const list = loadRaw();
    if (saved && list.some((p) => p.id === saved)) return saved;
    return list[0]?.id ?? null;
  });
  const [draft, setDraft] = useState<PilotSheet | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePilot =
    draft && draft.id === activeId
      ? draft
      : pilots.find((p) => p.id === activeId) ?? null;

  const commitPilot = useCallback((pilot: PilotSheet) => {
    const next = { ...pilot, updatedAt: new Date().toISOString() };
    setPilots((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id);
      const list = idx >= 0 ? prev.map((p, i) => (i === idx ? next : p)) : [...prev, next];
      persist(list);
      return list;
    });
    setSavedAt(new Date());
    setDraft(null);
  }, []);

  const updatePilot = useCallback(
    (pilot: PilotSheet) => {
      setDraft(pilot);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => commitPilot(pilot), 400);
    },
    [commitPilot],
  );

  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const createPilot = useCallback(() => {
    const p = createEmptyPilotSheet(crypto.randomUUID());
    setActiveId(p.id);
    setDraft(p);
    commitPilot(p);
    return p;
  }, [commitPilot]);

  const selectPilot = useCallback((id: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraft(null);
    setActiveId(id);
  }, []);

  const deletePilot = useCallback((id: string) => {
    setPilots((prev) => {
      const list = prev.filter((p) => p.id !== id);
      persist(list);
      setActiveId((current) => {
        if (current !== id) return current;
        return list[0]?.id ?? null;
      });
      setDraft(null);
      return list;
    });
  }, []);

  const importPilot = useCallback(
    (json: string, replaceId = false) => {
      const imported = parsePilotImportJson(json, crypto.randomUUID());
      const pilot: PilotSheet = replaceId
        ? imported
        : { ...imported, id: crypto.randomUUID() };
      commitPilot(pilot);
      setActiveId(pilot.id);
      return pilot;
    },
    [commitPilot],
  );

  const resetPilot = useCallback(
    (id: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const fresh = createEmptyPilotSheet(id);
      setDraft(null);
      commitPilot(fresh);
      setActiveId(id);
    },
    [commitPilot],
  );

  const otherPilots = pilots.filter((p) => p.id !== activeId);

  return {
    pilots,
    activePilot,
    activeId,
    otherPilots,
    savedAt,
    createPilot,
    selectPilot,
    deletePilot,
    updatePilot,
    commitPilot,
    importPilot,
    resetPilot,
  };
}
