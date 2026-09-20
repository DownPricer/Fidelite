type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SunIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20.5 14.5A8.5 8.5 0 119.5 3.5a7 7 0 0011 11Z" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function QrCodeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
      <path d="M14.5 14.5h3v3M20.5 17.5v3h-3M17.5 20.5h-3M14.5 20.5v-2.2" />
    </svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7.5A2.5 2.5 0 015.5 5h11A2.5 2.5 0 0119 7.5V8H5.5A2.5 2.5 0 013 5.5Z" />
      <rect x="3" y="8" width="18" height="11" rx="2.2" />
      <path d="M15.5 13.5h2" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9.5V19a1 1 0 001 1h14a1 1 0 001-1V9.5" />
      <path d="M3 4h18l1.5 5.2a2 2 0 01-2 2.3 2.1 2.1 0 01-2-1.6 2.1 2.1 0 01-2 1.6 2.1 2.1 0 01-2-1.6 2.1 2.1 0 01-2 1.6 2.1 2.1 0 01-2-1.6 2.1 2.1 0 01-2 1.6 2.1 2.1 0 01-2-1.6 2.1 2.1 0 01-2 1.6 2 2 0 01-2-2.3Z" />
    </svg>
  );
}

export function ScanLineIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M3 12h18" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="8.5" width="17" height="4" rx="0.8" />
      <path d="M5 12.5V20a1 1 0 001 1h12a1 1 0 001-1v-7.5M12 8.5V21" />
      <path d="M12 8.5c-1-3-3-4.5-4.5-3.5S6 8.5 9 8.5M12 8.5c1-3 3-4.5 4.5-3.5S18 8.5 15 8.5" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l7 3v5.5c0 4.6-3 7.8-7 9-4-1.2-7-4.4-7-9V6Z" />
      <path d="M8.7 12.2l2.3 2.3 4.3-4.5" />
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z" />
      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
    </svg>
  );
}

export function WalletCardsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="6" width="14" height="10" rx="2" />
      <path d="M7 4h11a2 2 0 012 2v9" />
      <path d="M6 10.5h8" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
