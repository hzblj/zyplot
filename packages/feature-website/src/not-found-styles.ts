import {tv} from 'tailwind-variants'

export const notFoundStyles = tv({
  slots: {
    actions: 'mt-9 flex flex-wrap items-center gap-6',
    hero: 'mx-auto grid min-h-[calc(100vh-80px)] max-w-[1180px] content-center px-7 pb-24 max-[560px]:px-5 [&>h1]:mb-[22px] [&>h1]:mt-3.5 [&>h1]:max-w-[760px] [&>h1]:text-[clamp(40px,4.6vw,58px)] [&>h1]:font-bold [&>h1]:leading-[1.02] [&>h1]:tracking-[-.055em]',
    lede: 'max-w-[560px] text-lg leading-[1.55] text-content-secondary',
    secondaryLink: 'text-[15px] font-semibold text-content-secondary transition-colors hover:text-content-primary',
    suggestion:
      'group grid gap-1.5 rounded-2xl border border-border-secondary bg-surface-secondary p-[18px] transition-colors hover:border-border-primary',
    suggestionCopy: 'text-[13px] leading-[1.5] text-content-tertiary',
    suggestions: 'mt-[68px] grid max-w-[900px] grid-cols-3 gap-3.5 max-[800px]:grid-cols-1',
    suggestionTitle: 'text-[15px] font-semibold tracking-[-0.015em]',
  },
})
