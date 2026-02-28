"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim() ?? "";
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
    const displayName = (form.elements.namedItem("display_name") as HTMLInputElement)?.value?.trim() ?? "";

    if (!email || !password) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || undefined,
          full_name: displayName || undefined,
        },
      },
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is required, session may be null
    if (data.session) {
      router.push("/app");
      router.refresh();
      return;
    }

    setSuccessMessage("Check your email to confirm your account, then sign in.");
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div
          className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}
      {successMessage && (
        <div
          className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
          role="status"
        >
          {successMessage}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="display_name">Display name (optional)</Label>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="name"
          placeholder="Alex"
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          minLength={6}
          className="h-10"
        />
        <p className="text-xs text-muted-foreground">At least 6 characters</p>
      </div>
      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy
        </Link>
        .
      </p>
    </form>
  );
}
