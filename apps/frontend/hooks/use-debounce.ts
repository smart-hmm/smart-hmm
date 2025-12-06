import { useRef } from "react";

const useDebounce = () => {
  const timeout = useRef<NodeJS.Timeout>(null);

  function debounce(fn: () => void, delay = 200) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      fn();
    }, delay);
  }

  return {
    debounce,
  };
};

export default useDebounce;
