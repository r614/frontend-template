import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

declare global {
  interface Window {
    template: {
      token: () => Promise<void>;
    };
  }
}

export const useDevFunctions = () => {
  const { getToken } = useKindeAuth();

  window.template = {
    token: async () => {
      console.log(await getToken());
    },
  };
};
