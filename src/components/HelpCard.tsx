interface HelpCardProps {
  name: string;
  description: string;
  phone?: string;
  website?: string;
  websiteLabel?: string;
  isUrgent?: boolean;
}

export default function HelpCard({
  name,
  description,
  phone,
  website,
  websiteLabel,
  isUrgent = false,
}: HelpCardProps) {
  return (
    <div
      className={`bg-white rounded-sm p-6 border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300 ${
        isUrgent ? "border-l-[#C4775A]" : "border-l-[#EDD5CB]"
      }`}
    >
      <h3 className="font-playfair text-[#2D2A27] text-lg mb-2">{name}</h3>
      <p className="text-[#7A7470] text-sm leading-relaxed mb-4">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, "")}`}
            className="inline-flex items-center gap-2 text-[#C4775A] font-medium text-sm hover:text-[#A85E45] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C4775A] font-medium text-sm hover:text-[#A85E45] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {websiteLabel ?? "Visit Website"}
          </a>
        )}
      </div>
    </div>
  );
}
