import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/custom/enterprise-shell";
import { useAuth } from "@/contexts/authContext";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

const highlights = [
  {
    label: "Profiles reviewed faster",
    value: "2.4x",
    detail:
      "Clearer cards, tighter screening, less inbox churn for recruiters.",
  },
  {
    label: "Curated culinary roles",
    value: "180+",
    detail:
      "Front-of-house, pastry, prep, executive, and seasonal kitchen openings.",
  },
  {
    label: "Verified hiring flow",
    value: "FSSAI",
    detail:
      "Recruiter onboarding is structured for real restaurant teams, not generic job boards.",
  },
];

const pillars = [
  {
    icon: BriefcaseBusiness,
    title: "Built for kitchen hiring",
    description:
      "Role signals, portfolio details, and hiring actions are tailored to culinary recruiting instead of generic resumes.",
  },
  {
    icon: Users,
    title: "One place for both sides",
    description:
      "Chefs can manage applications and identity, while restaurants can post openings and track applicants in the same system.",
  },
  {
    icon: ShieldCheck,
    title: "Operationally grounded",
    description:
      "Recruiter setup captures company details early so the marketplace feels credible from the first interaction.",
  },
];

export default function Landing() {
  const scopeRef = useRef(null);
  const navigate = useNavigate();
  const { userLoggedIn, loading } = useAuth();

  useCulinaryPageMotion({ scopeRef });

  useEffect(() => {
    if (!loading && userLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [loading, navigate, userLoggedIn]);

  if (loading) {
    return (
      <div className="shell-canvas flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel flex items-center gap-3 px-5 py-4">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
            Preparing your workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-canvas overflow-hidden" ref={scopeRef}>
      <div className="absolute inset-x-0 top-0 z-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(224,106,33,0.24),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_bottom_right,rgba(47,100,68,0.18),transparent_36%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-10 pt-5 sm:px-6 lg:px-10 lg:pb-14">
        <header className="glass-panel cc-reveal flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <BrandMark subtitle="Culinary hiring atelier" />
          <div className="flex items-center gap-3">
            <Link
              className="hidden text-sm font-semibold text-text-sub-light transition hover:text-text-main-light sm:inline-flex dark:text-text-sub-dark dark:hover:text-text-main-dark"
              to="/login"
            >
              Sign in
            </Link>
            <Button asChild size="sm">
              <Link to="/register">Create account</Link>
            </Button>
          </div>
        </header>

        <main className="grid flex-1 gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-10">
          <section className="space-y-8">
            <div className="cc-reveal inline-flex items-center gap-2 rounded-full border border-ember-200 bg-ember-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-ember-700 shadow-sm backdrop-blur dark:border-ember-500/20 dark:bg-ember-500/10 dark:text-ember-200">
              <Sparkles className="h-3.5 w-3.5" />
              Chef marketplace reimagined
            </div>

            <div className="cc-reveal space-y-5">
              <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-[-0.06em] text-text-main-light dark:text-text-main-dark sm:text-6xl lg:text-[5.4rem] lg:leading-[0.95]">
                A sharper hiring floor for chefs and restaurant teams.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-text-sub-light dark:text-text-sub-dark sm:text-lg">
                CulinaryConnect turns hiring into a guided studio workflow:
                verified recruiter setup, portfolio-rich chef profiles, and a
                calmer application experience for both sides.
              </p>
            </div>

            <div className="cc-reveal flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="cc-pulse gap-2">
                <Link to="/register">
                  Start hiring or applying
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Open existing account</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.label}
                  className="cc-stagger-item cc-scroll-in executive-panel flex min-h-[170px] flex-col justify-between p-5"
                >
                  <div>
                    <p className="section-kicker">{item.label}</p>
                    <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-text-main-light dark:text-text-main-dark">
                      {item.value}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="glass-panel cc-reveal relative overflow-hidden p-6 sm:p-7 lg:p-8">
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),transparent)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-kicker">Studio view</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-text-main-light dark:text-text-main-dark">
                      Designed around real service rhythms
                    </h2>
                  </div>
                  <div className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/10 dark:text-forest-200">
                    Live workflow
                  </div>
                </div>

                <div className="grid gap-4">
                  {pillars.map(({ icon: Icon, title, description }) => (
                    <article
                      key={title}
                      className="cc-stagger-item cc-scroll-in rounded-[1.6rem] border border-white/80 bg-white/88 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary dark:bg-primary/16">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark">
                            {title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
                            {description}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
