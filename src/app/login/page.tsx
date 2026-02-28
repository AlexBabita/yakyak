import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login/login-form";
import { LoginSplashRight } from "@/components/login/login-splash-right";

export const metadata = {
  title: "Sign in — YakYak.dev",
  description: "Sign in to your YakYak account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left: login form (splash-style) */}
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:w-[min(100%,28rem)] sm:px-12 md:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary">
            <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
            YakYak.dev
          </Link>
          <div className="mt-10">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account to continue.
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right: full-height image / animation */}
      <LoginSplashRight />
    </div>
  );
}
