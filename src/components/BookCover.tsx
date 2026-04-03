export default function BookCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center bg-gradient-to-br from-[#C4775A] via-[#A85E45] to-[#7A4535] rounded-sm shadow-2xl ${className}`}
      style={{ aspectRatio: "2/3", minHeight: "320px" }}
    >
      {/* Book spine shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 rounded-l-sm" />

      {/* Book content */}
      <div className="text-center px-8 py-10">
        <p className="font-playfair text-[#FAF5EE]/60 text-xs tracking-[0.3em] uppercase mb-6">
          Alex Delon
        </p>
        <h3
          className="font-playfair text-[#FAF5EE] leading-tight mb-6"
          style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
        >
          LEAVING YOU...
          <br />
          <em>for me</em>
        </h3>
        <div className="w-12 h-px bg-[#FAF5EE]/40 mx-auto mb-6" />
        <p className="font-inter text-[#FAF5EE]/70 text-xs tracking-wide leading-relaxed">
          A journey of rediscovery,
          <br />
          courage, and healing
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#FAF5EE]/20" />
      <div className="absolute bottom-4 left-8 w-8 h-8 border-b border-l border-[#FAF5EE]/20" />
    </div>
  );
}
