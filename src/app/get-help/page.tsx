import type { Metadata } from "next";
import HelpCard from "@/components/HelpCard";

export const metadata: Metadata = {
  title: "Get Help",
  description:
    "You are not alone. Find hotlines, online resources, and local support for women healing from narcissistic and abusive relationships.",
};

const NATIONAL_HOTLINES = [
  {
    name: "National Domestic Violence Hotline",
    description:
      "Available 24/7, this hotline provides crisis intervention, safety planning, and referrals to local programs. Advocates are available by phone or text.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org",
    websiteLabel: "thehotline.org",
    isUrgent: true,
  },
  {
    name: "Crisis Text Line",
    description:
      "Text HOME to 741741 to connect with a trained crisis counselor. Free, 24/7 support available anywhere in the USA.",
    phone: "Text HOME to 741741",
    isUrgent: true,
  },
  {
    name: "RAINN National Sexual Assault Hotline",
    description:
      "Confidential support from trained staff members. Also connects callers to local service providers in their area.",
    phone: "1-800-656-4673",
    website: "https://www.rainn.org",
    websiteLabel: "rainn.org",
    isUrgent: true,
  },
  {
    name: "Suicide & Crisis Lifeline",
    description:
      "If you are in emotional distress or crisis, call or text 988. Provides free and confidential support 24/7.",
    phone: "988",
    website: "https://988lifeline.org",
    websiteLabel: "988lifeline.org",
    isUrgent: true,
  },
];

const ONLINE_RESOURCES = [
  {
    name: "Loveisrespect",
    description:
      "Focused on prevention, education, and healthy relationship promotion for young people. Offers chat, text, and phone support.",
    website: "https://www.loveisrespect.org",
    websiteLabel: "loveisrespect.org",
  },
  {
    name: "National Center on Domestic Violence",
    description:
      "Resources, research, and referrals to help survivors of domestic and intimate partner violence.",
    website: "https://www.ncadv.org",
    websiteLabel: "ncadv.org",
  },
  {
    name: "Psychology Today — Find a Therapist",
    description:
      "Search for therapists specializing in trauma, narcissistic abuse recovery, and relationship issues near you.",
    website: "https://www.psychologytoday.com/us/therapists",
    websiteLabel: "Find a Therapist",
  },
  {
    name: "Out of the FOG",
    description:
      "An online resource for family members of people with personality disorders, including narcissistic personality disorder.",
    website: "https://outofthefog.website",
    websiteLabel: "outofthefog.website",
  },
];

const LOCAL_SUPPORT = [
  {
    name: "Local Women's Shelters",
    description:
      "Women's shelters offer safe emergency housing, support services, and legal advocacy. Search by zip code through the National Domestic Violence Hotline.",
    website: "https://www.thehotline.org/get-help/domestic-violence-local-resources",
    websiteLabel: "Find local shelters",
  },
  {
    name: "Legal Aid Services",
    description:
      "Free or low-cost legal help for survivors of domestic violence, including restraining orders, divorce proceedings, and child custody.",
    website: "https://www.lawhelp.org",
    websiteLabel: "lawhelp.org",
  },
  {
    name: "Community Mental Health Centers",
    description:
      "SAMHSA's treatment locator helps you find mental health services and substance use treatment facilities near you.",
    website: "https://findtreatment.gov",
    websiteLabel: "findtreatment.gov",
  },
];

export default function GetHelpPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE]">
      {/* Header */}
      <div
        className="py-20"
        style={{ background: "linear-gradient(135deg, #EDD5CB 0%, #F5EDE0 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-px bg-[#C4775A] mb-4" />
          <h1
            className="font-playfair text-[#2D2A27] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Help & Hotline Information
          </h1>
          <p className="text-[#4A4540] text-lg max-w-2xl leading-relaxed">
            You are not alone. If you or someone you know needs help, these resources are here for
            you. Reaching out is a sign of strength — not weakness.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Urgent message */}
        <div className="bg-[#2D2A27] text-[#FAF5EE] rounded-sm p-8 mb-16">
          <p className="font-playfair text-xl mb-2">If you are in immediate danger</p>
          <p className="text-[#B8B0A8] text-sm leading-relaxed">
            Please call <strong className="text-[#EDD5CB]">911</strong> or your local emergency
            services immediately. Your safety comes first.
          </p>
        </div>

        {/* National Hotlines */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#C4775A]" />
            <h2 className="font-playfair text-[#2D2A27] text-2xl">National Hotlines</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {NATIONAL_HOTLINES.map((r) => (
              <HelpCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* Online Resources */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#C4775A]" />
            <h2 className="font-playfair text-[#2D2A27] text-2xl">Online Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ONLINE_RESOURCES.map((r) => (
              <HelpCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* Local Support */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#C4775A]" />
            <h2 className="font-playfair text-[#2D2A27] text-2xl">Local Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LOCAL_SUPPORT.map((r) => (
              <HelpCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-[#F5EDE0] rounded-sm p-10 text-center">
          <h3 className="font-playfair text-[#2D2A27] text-2xl mb-3">
            You don&apos;t have to face this alone
          </h3>
          <p className="text-[#4A4540] leading-relaxed mb-6 max-w-xl mx-auto">
            The Universally Us community is here to walk this path with you. Connect with others who understand.
          </p>
          <a href="/register" className="btn-primary">
            Join the Community →
          </a>
        </div>
      </div>
    </div>
  );
}
