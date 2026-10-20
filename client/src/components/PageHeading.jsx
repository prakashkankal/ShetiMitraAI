export default function PageHeading({ eyebrow, title, description }) {
  return <div className="mb-6"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-leaf">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p></div>
}
