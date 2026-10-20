const paths = {
  camera: <><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="4"/></>,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0m-7 7v3m-4 0h8"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z"/></> ,
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
  scan: <><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 9c.2-2.3 1.5-3.8 4-4M12 15c-.2 2.3-1.5 3.8-4 4"/></>,
  history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
  weather: <><path d="M7 18a4 4 0 1 1 .8-7.9A5 5 0 0 1 17.5 9 3.5 3.5 0 1 1 18 18"/><path d="M12 20v2m-5-2 1 1m9-1-1 1"/></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v15M8 7h8m-8 4h8"/></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
  leaf: <><path d="M20 4c-7 0-13 2.6-13 9a6 6 0 0 0 6 6c6.4 0 7-8 7-15Z"/><path d="M4 21c2-5 6-8 11-11"/></>,
  cloud: <><path d="M7 18a4 4 0 1 1 .8-7.9A5 5 0 0 1 17.5 9 3.5 3.5 0 1 1 18 18z"/></>,
  sprout: <><path d="M12 21v-9m0 4c0-5-3-7-8-7 0 5 2 8 8 8m0-5c0-5 3-7 8-7 0 5-2 8-8 8"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
}

export function Icon({ name, size = 20, className = '' }) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
