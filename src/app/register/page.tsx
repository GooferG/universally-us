"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

type Status = "idle" | "submitting" | "pending-approval" | "error";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed. Please try again.");
      setStatus("idle");
      return;
    }

    // Account created — now pending Nancy's approval via New User Approve plugin
    setStatus("pending-approval");
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

        {status === "pending-approval" ? (
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
            <h2 className="font-playfair text-[#2D2A27] text-2xl mb-3">
              You&apos;re on the list!
            </h2>
            <p className="text-[#4A4540] leading-relaxed mb-2">
              Your account is pending approval. Once approved you&apos;ll receive a confirmation
              email at <strong className="text-[#2D2A27]">{formData.email}</strong>.
            </p>
            <p className="text-[#7A7470] text-sm mb-8">
              This usually takes less than 24 hours.
            </p>
            <Link href="/" className="btn-primary">
              Return Home →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-sm p-8 shadow-sm border border-[#EEE0CC]">
            <h1 className="font-playfair text-[#2D2A27] text-2xl mb-2">Join Us</h1>
            <p className="text-[#7A7470] text-sm mb-8">
              Create your free account. Your privacy is always protected.
            </p>

            {/* Google — shown when configured */}
            {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
              <>
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-3 border border-[#EEE0CC] py-3 text-sm font-medium text-[#4A4540] hover:border-[#C4775A] hover:text-[#C4775A] transition-colors mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#EEE0CC]" />
                  <span className="text-[#B8B0A8] text-xs">or</span>
                  <div className="flex-1 h-px bg-[#EEE0CC]" />
                </div>
              </>
            )}

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#4A4540] mb-2">
                  Username <span className="text-[#C4775A]">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A4540] mb-2">
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
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4A4540] mb-2">
                  Password <span className="text-[#C4775A]">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4A4540] mb-2">
                  Confirm Password <span className="text-[#C4775A]">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                  placeholder="Repeat your password"
                />
              </div>

              <p className="text-xs text-[#B8B0A8] leading-relaxed">
                By joining, you agree that your information will never be shared, sold, or given to
                third parties. Your privacy is our priority.
              </p>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full justify-center disabled:opacity-70"
              >
                {status === "submitting" ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-[#7A7470] mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#C4775A] hover:text-[#A85E45] transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
