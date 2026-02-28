"use client";

/**
 * Right panel: full-height visual. Replace the gradient + animation with
 * a static image (e.g. <img className="object-cover ..." />) or video if you prefer.
 */
export function LoginSplashRight() {
  return (
    <div className="relative hidden min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 lg:block">
      {/* Optional: use your own image
        <img
          src="/login-splash.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      */}
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Center content: tagline or logo */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="max-w-md text-center text-white/95">
          <p className="text-xl font-medium tracking-tight sm:text-2xl">
            Dev speak → everyone&apos;s language
          </p>
          <p className="mt-3 text-sm text-white/80">
            Translate between developers, PMs, QA, and designers in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
