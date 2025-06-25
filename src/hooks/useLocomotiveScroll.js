import { useEffect } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

const useLocomotiveScroll = () => {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || typeof document === "undefined") return;
    let scroll;
    import("locomotive-scroll").then((LocomotiveScrollModule) => {
      const LocomotiveScroll = LocomotiveScrollModule.default;
      const scrollEl = document.querySelector("[data-scroll-container]");
      if (!scrollEl) return;
      scroll = new LocomotiveScroll({
        el: scrollEl,
        smooth: true,
        lerp: 0.08,
        multiplier: 1,
        class: "is-reveal",
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });
    });
    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);
};

export default useLocomotiveScroll;
