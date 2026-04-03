import type { Metadata } from "next";
import BookCover from "@/components/BookCover";

export const metadata: Metadata = {
  title: "The Books",
  description:
    "LEAVING YOU... for me by Alex Delon — an honest, poignant, and often funny book about reclaiming your life.",
};

const QUESTIONS = [
  "When is enough finally enough?",
  "What does it feel like to walk away from a life partner – and how do we handle the guilt associated with fracturing a family?",
  "What happens to family traditions, family holidays, to family itself when we decide to leave – and when they bring in someone else to take our place?",
  "Are we expendable, replaceable, or is there simply a repositioning that takes place?",
  "How do we hold our own in negotiations when intimidation comes into play?",
  "How do we face down dating fears in a world that has changed dramatically since last we dated?",
  "Where does adventurous end and promiscuous begin?",
  "Is it possible to keep old friends – those you shared as a couple – in your life?",
  "How do we define our boundaries? Moreover, how do we set them in a world in which boundaries seem a thing of the past?",
  "What are some of the real hazards of dating – even of dating seemingly great guys?",
  "How do we start over as a one in a world that seems defined by twos?",
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE]">
      {/* Header */}
      <div className="bg-[#F5EDE0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-px bg-[#C4775A] mb-4" />
          <h1
            className="font-playfair text-[#2D2A27]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            The Books
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Content — 2/3 width */}
          <div className="lg:col-span-2">
            <p className="section-eyebrow">Featured Book</p>
            <h2
              className="font-playfair text-[#2D2A27] mb-8"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
            >
              LEAVING YOU... <em>for me</em>
            </h2>

            <div className="space-y-5 text-[#4A4540] leading-relaxed mb-10">
              <p>
                While there are any number of dating guides out there – books on everything from how
                to get a man to how to keep him, books which give us rules and books which encourage
                us to break rules, books which idealize romance and others which aspire to empower us
                to reclaim and retain our independence – few books speak honestly to the trials,
                tribulations, poignancy and humor of re-entering the dating pool after a long,
                monogamous relationship, or to what it might take to muster the courage and mettle to
                do so.
              </p>

              <p>
                Alex Delon was 17 when she married and 65 when she left. Having worked with her
                husband to build a multi-faceted, multi-million-dollar business which now sustained
                not just them but the families of two of their three grown children, having been the
                wife, mother, lover, and partner, and having first lived in denial of her
                husband&apos;s infidelities and then believed his multiple promises they would stop,
                at age 65 she finally walked out.
              </p>

              <p>
                Despite the back-story, <em>Leaving You…for me</em> is neither a rant nor sermon, a
                tirade nor a pedantic list of rules. And despite the author&apos;s age, it is not
                written for seniors. Rather, <em>Leaving You…for me</em> is a book for any woman
                seeking to reclaim her sense of self, her sense of humor, and her sense of adventure
                in the wake of a failed relationship – whatever her age.
              </p>

              <p>
                Anecdotally sharing her own adventures and misadventures, insecurities and missteps,
                triumphs and tribulations, Alex makes her readers laugh – and shed a tear or two – as
                they feel and experience what it&apos;s like to begin again.
              </p>
            </div>

            {/* Questions the book addresses */}
            <div className="bg-[#F5EDE0] rounded-sm p-8 mb-10">
              <h3 className="font-playfair text-[#2D2A27] text-xl mb-6">
                Questions this book addresses:
              </h3>
              <ul className="space-y-4">
                {QUESTIONS.map((q, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-[#C4775A] font-playfair font-bold flex-shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <p className="text-[#4A4540] leading-relaxed">{q}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[#4A4540] leading-relaxed mb-10">
              Just a few of the questions Alex addresses in this honest, informative, poignant, and
              often funny book, <em>Leaving You…for me</em> provides a window into the reasons we
              stay, why we might finally leave, and what we really face when we finally decide to do
              so. You will laugh, you will cry, and as you finish reading{" "}
              <em>Leaving You…for me</em> you will know with certainty that whatever your decision,
              you have the right – and the power – to define the rest of your life.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button className="btn-outline">Read a Sample</button>
              <a
                href="https://www.amazon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Buy Now on Amazon
              </a>
            </div>
          </div>

          {/* Sidebar — book cover */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6 lg:sticky lg:top-28">
            <BookCover className="w-full max-w-[280px]" />
            <div className="text-center">
              <p className="font-playfair italic text-[#7A7470] text-sm">by Alex Delon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
