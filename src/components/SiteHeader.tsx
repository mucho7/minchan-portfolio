import { FOCUS_CLASSNAME } from './portfolio/styles';

type SiteHeaderProps = {
  homeHref: string;
  workHref: string;
  aboutHref: string;
  engineeringHref: string;
  contactHref: string;
  currentPath?: string;
};

export function SiteHeader({
  homeHref,
  workHref,
  aboutHref,
  engineeringHref,
  contactHref,
  currentPath
}: SiteHeaderProps) {
  const links = [
    { href: workHref, label: 'Work' },
    { href: aboutHref, label: 'About' },
    { href: engineeringHref, label: 'Engineering', className: 'hidden sm:inline' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-14">
        <a href={homeHref} className={`text-sm font-semibold tracking-[-0.02em] ${FOCUS_CLASSNAME}`}>김민찬</a>
        <nav aria-label="주요 메뉴" className="flex items-center gap-4 text-xs font-medium text-[var(--ink-muted)] sm:gap-7 sm:text-sm">
          {links.map(({ href, label, className = '' }) => (
            <a
              key={href}
              href={href}
              aria-current={currentPath?.startsWith(href) ? 'page' : undefined}
              className={`${className} transition-colors hover:text-[var(--ink)] aria-[current=page]:text-[var(--ink)] ${FOCUS_CLASSNAME}`}
            >
              {label}
            </a>
          ))}
          <a
            href={contactHref}
            aria-current={currentPath?.startsWith(contactHref) ? 'page' : undefined}
            className={`rounded-full bg-[var(--ink)] px-4 py-2 text-white transition-transform active:scale-[0.98] ${FOCUS_CLASSNAME}`}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
