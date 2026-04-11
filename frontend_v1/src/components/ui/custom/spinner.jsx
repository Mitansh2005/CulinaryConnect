const Spinner = ({ className = "", label = "Loading workspace" }) => {
  return (
    <div className="inline-flex items-center gap-3 text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
      <span
        className={`h-5 w-5 rounded-full border-2 border-primary/25 border-t-primary animate-spin ${className}`}
      />
      <span>{label}</span>
    </div>
  );
};

export default Spinner;
