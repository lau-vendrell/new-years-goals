import { useEffect, useState } from 'react';

type Serializer<T> = {
  parse(value: string): T;
  stringify(value: T): string;
};

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  serializer: Serializer<T>
) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initialValue;
    try {
      return serializer.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, serializer.stringify(state));
    } catch {
      return;
    }
  }, [key, serializer, state]);

  return [state, setState] as const;
}
