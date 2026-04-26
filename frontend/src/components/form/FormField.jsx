const FormField = ({ label, error, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
      {label}
      {required && <span className="text-emerald-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-400 text-xs flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
)

export default FormField