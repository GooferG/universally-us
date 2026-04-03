"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    _hp: "", // honeypot — hidden from humans, bots fill it in
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
    } else {
      setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

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
            Contact Us
          </h1>
          <p className="text-[#7A7470] mt-2">We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — supporting text */}
          <div>
            <h2 className="font-playfair text-[#2D2A27] text-2xl mb-6">
              We&apos;re here to listen
            </h2>
            <div className="space-y-4 text-[#4A4540] leading-relaxed">
              <p>
                Whether you have a question about the community, want to share your story, or simply
                need someone to reach out to — our team is here for you.
              </p>
              <p>Every message is read with care. We aim to respond within 2–3 business days.</p>
              <p className="italic text-[#7A7470]">
                &ldquo;In the middle of difficulty lies opportunity for growth.&rdquo;
              </p>
            </div>

            <div className="mt-10 p-6 bg-[#F5EDE0] rounded-sm border-l-4 border-[#C4775A]">
              <p className="font-playfair text-[#2D2A27] font-medium mb-1">
                Need immediate help?
              </p>
              <p className="text-[#4A4540] text-sm leading-relaxed">
                If you&apos;re in crisis, please visit our{" "}
                <a
                  href="/get-help"
                  className="text-[#C4775A] hover:text-[#A85E45] transition-colors"
                >
                  Get Help
                </a>{" "}
                page for hotlines and immediate resources.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === "success" ? (
              <div className="bg-white rounded-sm p-10 text-center shadow-sm border border-[#EEE0CC]">
                <div className="w-16 h-16 bg-[#EDD5CB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-[#C4775A]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-playfair text-[#2D2A27] text-2xl mb-3">Message Sent</h3>
                <p className="text-[#4A4540] leading-relaxed mb-6">
                  Thank you for reaching out, {formData.name}. We&apos;ll be in touch within
                  2–3 business days.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFormData({ name: "", email: "", subject: "", message: "", _hp: "" });
                  }}
                  className="btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-sm p-8 shadow-sm border border-[#EEE0CC] space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#4A4540] mb-2"
                    >
                      Your Name <span className="text-[#C4775A]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#4A4540] mb-2"
                    >
                      Email <span className="text-[#C4775A]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[#4A4540] mb-2"
                  >
                    Subject <span className="text-[#C4775A]">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#4A4540] mb-2"
                  >
                    Message <span className="text-[#C4775A]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors resize-none"
                    placeholder="Share what's on your mind…"
                  />
                </div>

                {/* Honeypot — hidden from real users, bots fill it in */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                  <label htmlFor="_hp">Leave this field blank</label>
                  <input
                    id="_hp"
                    name="_hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData._hp}
                    onChange={handleChange}
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full justify-center disabled:opacity-70"
                >
                  {status === "submitting" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
