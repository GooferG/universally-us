"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "success" : "error");
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="font-playfair text-2xl text-[#2D2A27] hover:text-[#C4775A] transition-colors"
          >
            Universally <em>Us</em>
          </Link>
          <div className="w-12 h-px bg-[#C4775A] mx-auto mt-4" />
        </div>

        <div className="bg-white rounded-sm p-8 shadow-sm border border-[#EEE0CC]">
          <h1 className="font-playfair text-[#2D2A27] text-2xl mb-2">Reset Your Password</h1>
          <p className="text-[#7A7470] text-sm mb-8">
            Enter the email address on your account and we&apos;ll send you a link to reset your
            password.
          </p>

          {status === "success" ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EDD5CB] flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-[#C4775A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-playfair text-[#2D2A27] text-lg">Check your inbox</p>
              <p className="text-[#7A7470] text-sm leading-relaxed">
                If an account exists for <strong className="text-[#2D2A27]">{email}</strong>, you
                will receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-sm text-[#C4775A] hover:text-[#A85E45] transition-colors font-medium"
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  Something went wrong. Please try again.
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A4540] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full justify-center disabled:opacity-70"
              >
                {status === "submitting" ? "Sending…" : "Send Reset Link"}
              </button>

              <p className="text-center text-sm text-[#7A7470]">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-[#C4775A] hover:text-[#A85E45] transition-colors font-medium"
                >
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
