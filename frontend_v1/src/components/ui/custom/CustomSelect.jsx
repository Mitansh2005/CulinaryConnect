/**
 * CustomSelect — Culinary Atelier Design System
 *
 * Renders the dropdown via a React Portal (document.body) so it is never
 * clipped by parent overflow, stacking contexts, or sticky footers.
 *
 * options: Array<{ value: string, label: string }>
 * onChange: (e: { target: { name, value } }) => void
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  // Calculate portal position based on trigger's bounding rect
  const calcPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      top: rect.bottom + 4,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  // Recalculate on open + scroll/resize
  useEffect(() => {
    if (open) {
      calcPosition();
      window.addEventListener("scroll", calcPosition, true);
      window.addEventListener("resize", calcPosition);
    }
    return () => {
      window.removeEventListener("scroll", calcPosition, true);
      window.removeEventListener("resize", calcPosition);
    };
  }, [open, calcPosition]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Keyboard navigation
  function handleKeyDown(e) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const next =
        e.key === "ArrowDown"
          ? Math.min(idx + 1, options.length - 1)
          : Math.max(idx - 1, 0);
      if (options[next]) {
        onChange({ target: { name, value: options[next].value } });
      }
    }
  }

  function select(optionValue) {
    onChange({ target: { name, value: optionValue } });
    setOpen(false);
  }

  const dropdownPanel = (
    <AnimatePresence>
      {open && (
        <motion.ul
          ref={panelRef}
          role="listbox"
          style={dropdownStyle}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="
            max-h-[280px] overflow-y-auto rounded-2xl border border-stone-300/60
            shadow-2xl shadow-stone-900/20 backdrop-blur-md
            bg-[#fdf6ee] dark:bg-[#2a2118] dark:border-white/10 dark:shadow-black/50
          "
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(opt.value)}
                className={`
                  flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm
                  transition-colors duration-100 first:rounded-t-2xl last:rounded-b-2xl
                  ${
                    isSelected
                      ? "bg-primary/15 font-semibold text-primary dark:bg-primary/20 dark:text-amber-300"
                      : "text-text-main-light hover:bg-[#f5e6d0] dark:text-text-main-dark dark:hover:bg-white/[0.08]"
                  }
                `}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary dark:text-amber-300" />
                )}
              </li>
            );
          })}
        </motion.ul>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`
          soft-input mt-1.5 flex w-full items-center justify-between gap-2 text-left
          ${!selected ? "text-text-sub-light dark:text-text-sub-dark" : ""}
          ${open ? "border-primary/60 ring-4 ring-primary/10" : ""}
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <span className="truncate text-sm">
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="shrink-0 text-primary"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Portal — renders outside all parent stacking contexts */}
      {typeof document !== "undefined" &&
        createPortal(dropdownPanel, document.body)}
    </div>
  );
}
