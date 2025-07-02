import { useEffect } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

const useLocomotiveScroll = () => {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    let scroll: any;
    import("locomotive-scroll")
      .then((LocomotiveScrollModule) => {
        const LocomotiveScroll = LocomotiveScrollModule.default;
        const scrollEl = document.querySelector("[data-scroll-container]");
        // Fix: Only proceed if scrollEl is an HTMLElement (for TS/JS safety)
        if (!scrollEl || !(scrollEl instanceof (window.HTMLElement || HTMLElement)))
          return;
        scroll = new LocomotiveScroll({
          el: scrollEl,
          smooth: true,
          lerp: 0.08,
          multiplier: 1,
          class: "is-reveal",
          // Use type assertion to bypass TypeScript strict checking for device options
        } as any);
      })
      .catch(() => {});
    return () => {
      if (scroll && typeof scroll.destroy === "function") scroll.destroy();
    };
  }, []);
};

export default useLocomotiveScroll;
