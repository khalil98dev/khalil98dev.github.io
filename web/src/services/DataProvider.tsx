import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, type ResumePayload } from '@/services/api';
import type { FormationsPayload } from '@/types';

interface DataState {
  resume: ResumePayload | null;
  formations: FormationsPayload | null;
  error: Error | null;
  loading: boolean;
}

const DataContext = createContext<DataState>({ resume: null, formations: null, error: null, loading: true });

/** Loads all site content once and shares it across routes. */
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({ resume: null, formations: null, error: null, loading: true });

  useEffect(() => {
    let alive = true;
    Promise.all([api.getResume(), api.getFormations()])
      .then(([resume, formations]) => alive && setState({ resume, formations, error: null, loading: false }))
      .catch((error: Error) => alive && setState((s) => ({ ...s, error, loading: false })));
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
