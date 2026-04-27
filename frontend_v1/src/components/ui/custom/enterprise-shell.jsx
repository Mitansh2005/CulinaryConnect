/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { ChefHat, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function resolveMediaSrc(media, mime = "image/jpeg") {
  if (!media) return "";
  if (media.startsWith("http") || media.startsWith("data:")) {
    return media;
  }
  return `data:${mime};base64,${media.replace(/\s/g, "")}`;
}

export function getInitials(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function BrandMark({
  compact = false,
  subtitle = "Verified culinary hiring",
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary shadow-float">
        <div className="absolute inset-[1px] rounded-[15px] border border-white/20 bg-white/10" />
        <ChefHat className="relative z-10 h-5 w-5 text-white" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark">
            CulinaryConnect
          </p>
          <p className="truncate text-xs font-medium uppercase tracking-[0.22em] text-text-sub-light dark:text-text-sub-dark">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-8 pt-4 sm:px-6 lg:px-10 lg:pb-10 lg:pt-5",
        className,
      )}
    >
      {(title || description || actions || eyebrow) && (
        <div
          className={cn(
            "glass-panel flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-end lg:justify-between",
            headerClassName,
          )}
        >
          <div className="max-w-3xl">
            {eyebrow ? <p className="section-kicker mb-3">{eyebrow}</p> : null}
            {title ? (
              <h1 className="text-balance font-display text-3xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark sm:text-4xl lg:text-[2.8rem]">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-sub-light dark:text-text-sub-dark sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}

export function SurfaceCard({ className, children, ...props }) {
  return (
    <section className={cn("executive-panel p-6", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
        {title ? (
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-2 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = "primary",
  className,
}) {
  const toneStyles = {
    primary: "bg-primary/12 text-primary dark:bg-primary/16 dark:text-primary",
    brass:
      "bg-secondary/14 text-secondary dark:bg-secondary/12 dark:text-secondary",
    slate: "bg-slate-900/8 text-slate-700 dark:bg-white/8 dark:text-slate-200",
  };

  return (
    <SurfaceCard
      className={cn("flex h-full flex-col justify-between gap-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
            {label}
          </p>
          <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-text-main-light dark:text-text-main-dark">
            {value}
          </p>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50",
              toneStyles[tone] || toneStyles.primary,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {helper ? (
        <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
          {helper}
        </p>
      ) : null}
    </SurfaceCard>
  );
}

export function StatusPill({ children, tone = "neutral", className }) {
  const toneStyles = {
    neutral:
      "border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300",
    success:
      "border-forest-200 bg-forest-50 text-forest-700 dark:border-forest-500/30 dark:bg-forest-500/20 dark:text-forest-300",
    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
    danger:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300",
    info: "border-ember-200 bg-ember-50 text-ember-700 dark:border-ember-500/30 dark:bg-ember-500/20 dark:text-ember-300",
    salary:
      "border-primary/20 bg-primary/5 text-primary-700 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-300",
    location:
      "border-forest-200 bg-forest-50 text-forest-700 dark:border-forest-500/30 dark:bg-forest-500/20 dark:text-forest-300",
    deadline:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em]",
        toneStyles[tone] || toneStyles.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyPanel({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  className,
}) {
  return (
    <SurfaceCard
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center gap-4 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary dark:bg-primary/16">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark">
          {title}
        </h3>
        <p className="mx-auto max-w-md text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
          {description}
        </p>
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </SurfaceCard>
  );
}

export function Avatar({ src, name, icon: Icon, className }) {
  const resolvedSrc = resolveMediaSrc(src, "image/png");
  const initials = getInitials(name || "Chef");

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-primary/10 text-sm font-bold text-primary dark:border-white/10 dark:bg-primary/10",
        className,
      )}
    >
      {resolvedSrc ? (
        <img
          alt={name || "Avatar"}
          className="h-full w-full object-cover"
          src={resolvedSrc}
        />
      ) : Icon ? (
        <Icon className="h-5 w-5" />
      ) : (
        initials || "CC"
      )}
    </div>
  );
}
