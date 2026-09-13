import { Hero } from './hero/Hero';
import type { ProjectViewModel } from '../types/portfolio';
import { SiteHeader } from './SiteHeader';

type PortfolioExperienceProps = {
  projects: readonly ProjectViewModel[];
  homeHref: string;
  aboutHref: string;
  workHref: string;
  contactHref: string;
  portfolioHref: string;
};

const ROOT_CLASSNAME = 'min-h-[100dvh] overflow-clip bg-[var(--paper)] text-[var(--ink)]';

export default function PortfolioExperience({
  projects,
  homeHref,
  aboutHref,
  workHref,
  contactHref,
  portfolioHref
}: PortfolioExperienceProps) {
  return (
    <div className={ROOT_CLASSNAME} data-hydrated="true">
      <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-white">
        본문으로 건너뛰기
      </a>

      <SiteHeader
        homeHref={homeHref}
        workHref={workHref}
        aboutHref={aboutHref}
        contactHref={contactHref}
      />

      <main>
        <Hero projects={projects} aboutHref={aboutHref} portfolioHref={portfolioHref} />
      </main>
    </div>
  );
}
