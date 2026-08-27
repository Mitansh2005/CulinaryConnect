import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/custom/enterprise-shell";

export default function ErrorPage() {
  return (
    <div className="shell-canvas flex min-h-screen items-center justify-center px-4 py-10">
      <SurfaceCard className="max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/12 text-primary dark:bg-primary/16">
          <Compass className="h-7 w-7" />
        </div>
        <p className="section-kicker mt-6">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-text-main-light dark:text-text-main-dark">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-text-sub-light dark:text-text-sub-dark">
          The page you requested is no longer available or the route is incorrect. Move back into the verified workspace from one of the primary entry points.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/login">Go to login</Link>
          </Button>
          <Button asChild>
            <Link to="/home">Open home</Link>
          </Button>
        </div>
      </SurfaceCard>
    </div>
  );
}
