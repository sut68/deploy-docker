import { useRef, useCallback } from "react";

/**
 * Custom hook to create modern refs that avoid findDOMNode deprecation warnings
 * @param initialValue - Initial value for the ref
 * @returns A ref object with modern React patterns
 */
export function useModernRef<T = any>(initialValue: T | null = null) {
  const ref = useRef<T | null>(initialValue);

  const setRef = useCallback((node: T | null) => {
    if (ref.current !== node) {
      // ref.current is mutable when using useRef<T | null>
      // assign the new node value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ref as any).current = node;
    }
  }, []);

  return [ref, setRef] as const;
}

/**
 * Hook to safely access DOM elements without findDOMNode
 * @param element - The element to create a ref for
 * @returns A ref that can be safely used with DOM elements
 */
export function useDOMRef<T extends HTMLElement = HTMLElement>() {
  return useRef<T>(null);
}
