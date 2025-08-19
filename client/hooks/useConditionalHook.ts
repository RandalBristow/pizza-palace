import { useRef } from 'react';

// Utility to conditionally enable/disable hooks while respecting Rules of Hooks
export function useConditionalHook<T>(
  shouldRun: boolean,
  hook: () => T,
  emptyValue: T
): T {
  const hookResult = useRef<T>(emptyValue);
  const hasRun = useRef(false);
  
  // Always call the hook, but only use result when needed
  const result = hook();
  
  if (shouldRun) {
    hookResult.current = result;
    hasRun.current = true;
  } else if (!hasRun.current) {
    hookResult.current = emptyValue;
  }
  
  return shouldRun ? result : emptyValue;
}
