import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const useLocomotiveScroll = () => {
  useEffect(() => {
    const scrollEl = document.querySelector("[data-scroll-container]");
    if (!scrollEl) return;
    const scroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      class: "is-reveal",
      smartphone: { smooth: true },
      tablet: { smooth: true },
    });
    return () => {
      scroll.destroy();
    };
  }, []);
};

export default useLocomotiveScroll;
