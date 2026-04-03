"use client";

import { useState, FormEvent } from "react";

export default function NewsletterSignup() {
  const [form, setForm] = useState({ name: "", email: "", _hp: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    <div className="bg-[#3A3633] rounded-sm p-8">
      <h4 className="font-playfair text-[#FAF5EE] text-lg mb-2">Stay Connected</h4>
      <p className="text-[#B8B0A8] text-sm mb-6 leading-relaxed">
        Receive articles, resources, and community updates in your inbox.
      </p>

      {status === "success" ? (
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#EDD5CB] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-3 h-3 text-[#C4775A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[#EDD5CB] text-sm leading-relaxed">
            You&apos;re subscribed! Thank you for joining us, {form.name}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2.5 bg-[#2D2A27] border border-[#4A4540] text-[#FAF5EE] placeholder-[#7A7470] text-sm focus:outline-none focus:border-[#C4775A] transition-colors"
          />
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="Your email address"
            className="w-full px-4 py-2.5 bg-[#2D2A27] border border-[#4A4540] text-[#FAF5EE] placeholder-[#7A7470] text-sm focus:outline-none focus:border-[#C4775A] transition-colors"
          />

          {status === "error" && (
            <p className="text-red-400 text-xs">{errorMsg}</p>
          )}

          {/* Honeypot */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
            <input
              name="_hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form._hp}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 bg-[#C4775A] text-[#FAF5EE] text-sm font-medium hover:bg-[#A85E45] transition-colors disabled:opacity-70"
          >
            {status === "submitting" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
