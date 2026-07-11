"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { CornerFlourish } from "@/components/Flourish";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(true);
    } else {
      router.push("/edit");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-paper)] flex items-center justify-center p-4">
      <div className="relative bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border-2 border-dashed border-[var(--color-secondary)]">
        
        {/* Corner Flourishes */}
        <CornerFlourish className="absolute top-3 left-3 w-6 h-6 opacity-80" />
        <CornerFlourish className="absolute top-3 right-3 w-6 h-6 opacity-80" />
        <CornerFlourish className="absolute bottom-3 left-3 w-6 h-6 opacity-80" />
        <CornerFlourish className="absolute bottom-3 right-3 w-6 h-6 opacity-80" />

        <div className="text-center mb-8 mt-2">
          <h1 className="text-4xl font-heading text-[var(--color-primary)] mb-2">Welcome Back</h1>
          <p className="text-[var(--color-text-body)]">Log in to add a new recipe to the book</p>
        </div>
        
        {error && (
          <div className="text-center text-[var(--color-primary)] bg-[var(--color-secondary)]/20 p-3 rounded-lg mb-6 border border-dashed border-[var(--color-primary)]/30">
            That email or password doesn't match.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-bold text-[var(--color-text-body)] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-dashed border-[var(--color-secondary)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
          <div>
            <label className="block font-bold text-[var(--color-text-body)] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-dashed border-[var(--color-secondary)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-3 px-4 rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-[var(--color-secondary)]"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
