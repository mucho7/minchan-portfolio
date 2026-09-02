export const FOCUS_CLASSNAME = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]';
export const EYEBROW_CLASSNAME = 'font-mono text-[0.68rem] uppercase tracking-[0.18em] text-black/45';
export const CTA_CLASSNAME = `inline-flex items-center gap-3 border-b border-current pb-1 text-sm font-medium transition hover:text-[var(--accent)] ${FOCUS_CLASSNAME}`;
export const CLOSE_BUTTON_CLASSNAME = `grid h-12 w-12 place-items-center rounded-full border border-black/35 bg-[var(--paper)] text-2xl transition hover:bg-black hover:text-[var(--paper)] ${FOCUS_CLASSNAME}`;
export const PROJECT_BUTTON_BASE_CLASSNAME = `group grid w-full gap-5 border-t border-black/25 py-7 text-left transition-colors sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:px-4 ${FOCUS_CLASSNAME}`;
export const PROJECT_BUTTON_OPEN_CLASSNAME = 'bg-black/[0.055]';
export const PROJECT_BUTTON_CLOSED_CLASSNAME = 'hover:bg-black/[0.035]';
