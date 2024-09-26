import { type DependencyList, useEffect, useRef } from "react";

export function useOnceEffect(cb: () => void, deps: DependencyList = []) {
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current) {
      cb();
      initRef.current = true;
    }
  }, deps);
}
