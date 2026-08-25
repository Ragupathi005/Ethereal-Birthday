import { useEffect, useState } from "react";

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const check = () =>
      setTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches || window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return touch;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
