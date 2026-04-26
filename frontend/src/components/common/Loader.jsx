const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-zinc-700 border-t-emerald-400 rounded-full animate-spin`} />
      {text && <p className="text-zinc-500 text-sm">{text}</p>}
    </div>
  )
}

export default Loader