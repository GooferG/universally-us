"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { WPComment, submitComment, formatDate } from "@/lib/api";

interface CommentsProps {
  postId: number;
  initialComments: WPComment[];
}

export default function Comments({ postId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<WPComment[]>(initialComments);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { data: session } = useSession();

  // Pre-fill name and email from session when user is logged in
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.user.name || "",
        email: prev.email || session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const result = await submitComment({
      postId,
      authorName: form.name,
      authorEmail: form.email,
      content: form.content,
    });

    if (result.ok && result.comment) {
      // WordPress may hold comment for moderation (status !== "approved")
      // Show it optimistically anyway; if moderated it will appear after approval
      setComments((prev) => [...prev, result.comment!]);
      setForm({ name: "", email: "", content: "" });
      setStatus("success");
    } else {
      setErrorMsg(result.error ?? "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-8 h-px bg-[#C4775A]" />
        <h2 className="font-playfair text-[#2D2A27] text-2xl">
          {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Comments"}
        </h2>
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-12">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="text-[#B8B0A8] font-playfair italic mb-12">
          Be the first to share your thoughts.
        </p>
      )}

      {/* Leave a comment */}
      <div className="bg-[#F5EDE0] rounded-sm p-8">
        <h3 className="font-playfair text-[#2D2A27] text-xl mb-2">Leave a Comment</h3>
        <p className="text-[#7A7470] text-sm mb-6">
          Your email address will not be published. Comments may be held for moderation.
        </p>

        {status === "success" ? (
          <div className="flex items-start gap-4 p-5 bg-white rounded-sm border border-[#EDD5CB]">
            <div className="w-8 h-8 rounded-full bg-[#EDD5CB] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#C4775A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#2D2A27] text-sm">Thank you for your comment!</p>
              <p className="text-[#7A7470] text-sm mt-1">
                It may appear immediately or after a brief review — depending on site settings.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-[#C4775A] text-sm font-medium mt-3 hover:text-[#A85E45] transition-colors"
              >
                Leave another comment
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4A4540] mb-2">
                  Name <span className="text-[#C4775A]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name (or a pseudonym)"
                  className="w-full px-4 py-3 bg-white border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Never displayed publicly"
                  className="w-full px-4 py-3 bg-white border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[#4A4540] mb-2">
                Comment <span className="text-[#C4775A]">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={5}
                value={form.content}
                onChange={handleChange}
                placeholder="Share your thoughts, questions, or experience…"
                className="w-full px-4 py-3 bg-white border border-[#EEE0CC] text-[#2D2A27] placeholder-[#B8B0A8] text-sm focus:outline-none focus:border-[#C4775A] focus:ring-1 focus:ring-[#C4775A]/30 transition-colors resize-none"
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
              className="btn-primary disabled:opacity-70"
            >
              {status === "submitting" ? "Posting…" : "Post Comment"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function CommentItem({ comment }: { comment: WPComment }) {
  const initials = comment.author_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#EDD5CB] flex items-center justify-center flex-shrink-0 font-playfair text-[#C4775A] text-sm font-medium">
        {initials}
      </div>

      <div className="flex-1 bg-white rounded-sm p-5 border border-[#EEE0CC]">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-medium text-[#2D2A27] text-sm">{comment.author_name}</span>
          <span className="text-[#D4C4B0] text-xs">·</span>
          <time className="text-[#B8B0A8] text-xs">{formatDate(comment.date)}</time>
        </div>
        <div
          className="text-[#4A4540] text-sm leading-relaxed wp-content"
          dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
        />
      </div>
    </div>
  );
}
