type IconProps = {className?: string}

export const CopyIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M10.5 5.5V4A2.5 2.5 0 0 0 8 1.5H4A2.5 2.5 0 0 0 1.5 4v4A2.5 2.5 0 0 0 4 10.5h1.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.25}
    />
    <rect height="9" rx="2.5" stroke="currentColor" strokeWidth={1.25} width="9" x="5.5" y="5.5" />
  </svg>
)

export const CheckIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M3 8.5 6.5 12 13 4.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
)

export const MenuIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path d="M2.25 4.5h11.5M2.25 8h11.5M2.25 11.5h11.5" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} />
  </svg>
)

export const LineChartIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M1.75 11.25 5.5 6.5l2.75 2.5L14.25 3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
)

export const CandlesIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path
      d="M5 1.75v2.5M5 11.25v3M11 2.75v3M11 12.25v1.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.4}
    />
    <rect height="7" rx="1.25" stroke="currentColor" strokeWidth={1.4} width="4" x="3" y="4.25" />
    <rect height="6.5" rx="1.25" stroke="currentColor" strokeWidth={1.4} width="4" x="9" y="5.75" />
  </svg>
)

export const CloseIcon = ({className}: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} />
  </svg>
)
