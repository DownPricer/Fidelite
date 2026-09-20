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

export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5Z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 010 5H17" />
      <path d="M7 3.5c-.6.7-.6 1.3 0 2M11 3.5c-.6.7-.6 1.3 0 2" />
    </svg>
  );
}

export function WifiIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 8.5a15 15 0 0120 0M5 12a10.5 10.5 0 0114 0M8.3 15.5a6 6 0 017.4 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l9 5-9 5-9-5Z" />
      <path d="M4.5 13.2L12 17l7.5-3.8" />
      <path d="M4.5 17.2L12 21l7.5-3.8" />
    </svg>
  );
}

export function PaletteIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3a9 8.5 0 100 17c1.1 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H16.5A3.5 3.5 0 0020 10.5C20 6.4 16.4 3 12 3Z" />
      <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ZapIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M13 3L4.5 13.5H11L10.5 21L19.5 10.5H13Z" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3.3" />
      <path d="M2.7 19c.8-3 3.3-5 6.3-5s5.5 2 6.3 5" />
      <path d="M16 4.3c1.5.4 2.6 1.7 2.6 3.3s-1.1 2.9-2.6 3.3" />
      <path d="M18.5 14.3c1.9.6 3.3 2.2 3.8 4.7" />
    </svg>
  );
}
