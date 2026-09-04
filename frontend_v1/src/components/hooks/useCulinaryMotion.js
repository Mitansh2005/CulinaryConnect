import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useCulinaryPageMotion(options = {}) {
  const { scopeRef, dependencies = [] } = options;

  useGSAP(
    () => {
      const scopeElement = scopeRef?.current;
      if (!scopeElement) return;

      const revealElements = gsap.utils.toArray(".cc-reveal", scopeElement);
      const staggerElements = gsap.utils.toArray(
        ".cc-stagger-item",
        scopeElement,
      );
      const scrollElements = gsap.utils.toArray(".cc-scroll-in", scopeElement);
      const pulseElements = gsap.utils.toArray(".cc-pulse", scopeElement);

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context?.conditions || {};

          if (reduceMotion) {
            if (revealElements.length) {
              gsap.set(revealElements, {
                autoAlpha: 1,
                y: 0,
                clearProps: "transform,opacity",
              });
            }

            if (staggerElements.length) {
              gsap.set(staggerElements, {
                autoAlpha: 1,
                y: 0,
                clearProps: "transform,opacity",
              });
            }

            if (scrollElements.length) {
              gsap.set(scrollElements, {
                autoAlpha: 1,
                y: 0,
                clearProps: "transform,opacity",
              });
            }

            return;
          }

          const intro = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
              gsap.set([...revealElements, ...staggerElements], {
                clearProps: "transform,opacity,visibility",
              });
            },
          });

          if (revealElements.length) {
            intro.from(revealElements, {
              autoAlpha: 0,
              y: 10,
              duration: 0.38,
              stagger: 0.04,
            });
          }

          if (staggerElements.length) {
            intro.from(
              staggerElements,
              {
                autoAlpha: 0,
                y: 10,
                duration: 0.34,
                stagger: {
                  each: 0.035,
                  from: "start",
                },
              },
              revealElements.length ? "-=0.15" : 0,
            );
          }

          if (scrollElements.length) {
            gsap.set(scrollElements, { autoAlpha: 0, y: 8 });

            ScrollTrigger.batch(scrollElements, {
              start: "top 95%",
              once: true,
              onEnter: (batch) => {
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.32,
                  stagger: 0.03,
                  ease: "power2.out",
                  clearProps: "transform,opacity,visibility",
                  overwrite: true,
                });
              },
            });
          }

          // Continuous infinite pulse removed per animation guidelines (Emil Kowalski)
          // Buttons use responsive hover/active micro-interactions instead of constant pulsing.
        },
      );

      return () => {
        mm.revert();
      };
    },
    {
      dependencies,
      revertOnUpdate: true,
    },
  );
}

export function useDepthCardMotion(options = {}) {
  const { disabled = false } = options;
  const cardRef = useRef(null);

  useGSAP(
    () => {
      if (disabled || !cardRef.current) return;

      const card = cardRef.current;
      const mm = gsap.matchMedia();

      mm.add(
        {
          noHover: "(hover: none)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion:
            "(hover: hover) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { noHover, reduceMotion } = context?.conditions || {};
          if (noHover || reduceMotion) {
            return;
          }

          const rotateX = gsap.quickTo(card, "rotationX", {
            duration: 0.25,
            ease: "power2.out",
          });
          const rotateY = gsap.quickTo(card, "rotationY", {
            duration: 0.25,
            ease: "power2.out",
          });
          const shiftY = gsap.quickTo(card, "y", {
            duration: 0.28,
            ease: "power2.out",
          });

          gsap.set(card, {
            transformPerspective: 1000,
            transformOrigin: "center center",
          });

          const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
            const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

            rotateY(relativeX * 10);
            rotateX(-relativeY * 9);
            shiftY(-3);
          };

          const onLeave = () => {
            rotateX(0);
            rotateY(0);
            shiftY(0);
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);

          return () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
            gsap.set(card, { clearProps: "transform" });
          };
        },
      );

      return () => {
        mm.revert();
      };
    },
    {
      dependencies: [disabled],
      revertOnUpdate: true,
    },
  );

  return cardRef;
}

export function useRouteTransition(options = {}) {
  const { scopeRef, dependencies = [] } = options;

  useGSAP(
    () => {
      const scopeElement = scopeRef?.current;
      if (!scopeElement) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context?.conditions || {};

          if (reduceMotion) {
            gsap.set(scopeElement, {
              autoAlpha: 1,
              y: 0,
              clearProps: "transform,opacity",
            });
            return;
          }

          gsap.fromTo(
            scopeElement,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
              clearProps: "transform,opacity",
            },
          );
        },
      );

      return () => {
        mm.revert();
      };
    },
    {
      dependencies,
      revertOnUpdate: true,
    },
  );
}
