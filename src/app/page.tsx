import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBlobs } from "@/components/landing/background-blobs";
import { HeroMessageDemo } from "@/components/landing/hero-message-demo";
import { TranslatorChat } from "@/components/translator/translator-chat";
import { HeroHeadline } from "@/components/landing/hero-headline";

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Paste or type your message",
    description:
      "Drop in a message from Slack, email, or any tool. Jargon, buzzwords, or unclear language—we’ll handle it.",
  },
  {
    step: 2,
    title: "Choose who it’s from and who it’s for",
    description:
      "Pick the sender role (e.g. Developer, PM) and the audience (Designer, Customer). Optional: add language translation.",
  },
  {
    step: 3,
    title: "YakYak it",
    description:
      "One click. We rewrite the message in clear, role-appropriate language so everyone gets it.",
  },
  {
    step: 4,
    title: "Copy, share, ship",
    description:
      "Use the translated message in standups, docs, or customer comms. Fewer follow-up questions, faster alignment.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What does YakYak do?",
    a: "YakYak translates team talk between roles. Paste a message from a developer, PM, QA, designer, or finance—pick who it’s for—and get a clear, jargon-free version that the other role actually understands.",
  },
  {
    q: "Who is YakYak for?",
    a: "Product and engineering teams who want fewer “wait, what?” moments. Developers explaining to PMs or designers, PMs writing for customers, QA reporting to devs—anyone who needs to say the same thing in different words.",
  },
  {
    q: "Is my data saved?",
    a: "When you use the try-it flow on the site, we don’t store your messages. When you use YakYak in your workspace (e.g. Slack), we process messages to translate them and retain only what’s needed to run the service—see our Privacy Policy for details.",
  },
  {
    q: "How accurate is the translation?",
    a: "We focus on clarity and role-appropriate tone, not word-for-word translation. For technical and product language, results are typically very accurate. For highly domain-specific or legal text, always review before sending.",
  },
  {
    q: "Can I use YakYak in Slack or email?",
    a: "Integrations are on our roadmap. Right now you can use the in-app translator and paste results wherever you need. Sign up to get notified when Slack and other integrations launch.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header above everything */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 sm:h-16">
          <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="text-lg font-bold text-primary sm:text-xl">YakYak</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex md:gap-6">
            <Link
              href="#problem"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Problem
            </Link>
            <Link
              href="#how"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#try"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Try now
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="sm:h-9 sm:px-4" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="sm:h-9 sm:px-4" asChild>
              <Link href="#try">Try it free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="relative flex-1" aria-label="Main content">
        {/* Blobs live inside main so they share stacking context with sections - spray shows through section backgrounds */}
        <BackgroundBlobs />
        {/* Hero */}
        <section className="relative z-10 overflow-hidden border-b border-border bg-gradient-to-b from-background/80 to-muted/30 px-4 py-16 sm:px-8 sm:py-28 lg:px-10 lg:py-32" aria-labelledby="hero-heading">
          <div className="mx-auto max-w-6xl">
            <header className="text-center">
              <HeroHeadline />
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:mt-8 sm:text-lg sm:text-xl">
                Translate technical, business, and AI messages between roles — instantly.
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground/90 sm:text-base sm:text-lg">
                Developer, PM, QA, DevOps, or LLM — clear intent. Zero back-and-forth.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="#try">Try it free</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="#how">See how it works</Link>
                </Button>
              </div>
            </header>
            <div className="mt-10 sm:mt-16 lg:mt-20">
              <HeroMessageDemo />
            </div>
          </div>
        </section>

        {/* Problem */}
        <section
          id="problem"
          className="relative z-10 scroll-mt-20 border-b border-border bg-background/60 px-4 py-14 sm:scroll-mt-24 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <header className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
                Lost in translation
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Teams ship faster when everyone speaks the same language. Too often, they don’t.
              </p>
            </header>
            <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:rounded-xl sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive" aria-hidden>
                  <span className="text-lg font-bold">?</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Jargon overload</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  “Refactor the auth layer” and “synergize deliverables” leave PMs and customers guessing. Misalignment and rework follow.
                </p>
              </article>
              <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:rounded-xl sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400" aria-hidden>
                  <span className="text-lg font-bold">↔</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Role mismatch</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  What devs say to each other doesn’t land with design or finance. Same idea, wrong words—and mixed signals.
                </p>
              </article>
              <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:col-span-2 sm:rounded-xl sm:p-6 lg:col-span-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden>
                  <span className="text-lg font-bold">⏱</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Wasted time</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Endless “can you explain?” threads and back-and-forth. YakYak turns one message into the right words for whoever’s reading.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="relative z-10 scroll-mt-20 border-b border-border bg-background/60 px-4 py-14 sm:scroll-mt-24 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <header className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
                How it works
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Four steps from messy message to clear, role-ready copy.
              </p>
            </header>
            <ol className="mt-10 grid gap-6 sm:mt-16 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Steps">
              {HOW_IT_WORKS_STEPS.map((item) => (
                <li key={item.step} className="relative list-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary bg-primary text-lg font-bold text-primary-foreground" aria-hidden>
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  {item.step < HOW_IT_WORKS_STEPS.length && (
                    <div className="absolute -right-4 top-6 hidden text-muted-foreground/50 lg:block" aria-hidden>
                      →
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Try now */}
        <section
          id="try"
          className="relative z-10 scroll-mt-20 bg-background/60 px-4 py-14 sm:scroll-mt-24 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
                Try it now
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Paste a message, pick from/to roles and optional languages, then YakYak it.
              </p>
            </header>
            <div className="mt-12">
              <TranslatorChat floatingInput={false} />
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No sign-up required. Create an account to save history and use YakYak in your workflow.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="relative z-10 scroll-mt-20 border-t border-border bg-background/60 px-4 py-14 sm:scroll-mt-24 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-5 text-muted-foreground">
                Everything you need to know about YakYak.
              </p>
            </header>
            <ul className="mt-10 space-y-2 sm:mt-16 sm:space-y-3" role="list">
              {FAQ_ITEMS.map((item) => (
                <li key={item.q}>
                  <details className="group rounded-lg border border-border bg-card sm:rounded-xl [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-foreground after:shrink-0 after:transition-transform group-open:after:rotate-180 after:content-['▼'] after:text-muted-foreground after:text-xs sm:gap-4 sm:px-5 sm:py-4">
                      <h3 className="m-0 text-sm font-semibold text-foreground sm:text-base">{item.q}</h3>
                    </summary>
                    <div className="border-t border-border px-4 py-3 sm:px-5 sm:py-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 border-t border-border bg-background/60 px-4 py-14 sm:px-8 sm:py-24 lg:px-10 lg:py-28" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="cta-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl sm:text-4xl">
              Ready to speak everyone’s language?
            </h2>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              Join teams who ship with less confusion and more clarity.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="#try">Try it free</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/login">Create account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background/70 px-4 py-12 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
              <span className="font-semibold text-foreground">YakYak</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#problem" className="hover:text-foreground">Problem</Link>
              <Link href="#how" className="hover:text-foreground">How it works</Link>
              <Link href="#try" className="hover:text-foreground">Try now</Link>
              <Link href="#faq" className="hover:text-foreground">FAQ</Link>
              <Link href="/login" className="hover:text-foreground">Log in</Link>
            </nav>
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} YakYak. Translate dev language to your team’s language.
          </p>
        </div>
      </footer>
    </div>
  );
}
