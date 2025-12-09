import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useLocomotiveScroll = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    let scroll: any = null;
    let isMounted = true;

    const initLocomotiveScroll = async () => {
      try {
        const LocomotiveScrollModule = await import("locomotive-scroll");
        const LocomotiveScroll = LocomotiveScrollModule.default;
        const scrollEl = document.querySelector("[data-scroll-container]") as HTMLElement;
        if (!scrollEl) {
          console.warn("Locomotive Scroll: No element with [data-scroll-container] found");
          return;
        }
        scroll = new LocomotiveScroll({
          el: scrollEl,
          smooth: true,
          lerp: 0.12,
          multiplier: 1.5,
          class: "is-reveal",
          reloadOnContextChange: true,
        });
        const handleResize = () => {
          if (scroll && typeof scroll.update === "function") {
            scroll.update();
          }
        };
        window.addEventListener("resize", handleResize);
        // Clean up on unmount
        if (isMounted) {
          return () => {
            window.removeEventListener("resize", handleResize);
          };
        }
      } catch (error) {
        console.warn("Failed to initialize Locomotive Scroll:", error);
      }
    };
    const timeoutId = setTimeout(initLocomotiveScroll, 100);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (scroll && typeof scroll.destroy === "function") {
        scroll.destroy();
      }
    };
  }, [pathname]);
};

export default useLocomotiveScroll;
