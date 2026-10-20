import { Icon } from './Icons.jsx'

const styles = {
  empty: { icon: 'leaf', color: 'bg-[#edf4e8] text-leaf' },
  unavailable: { icon: 'info', color: 'bg-[#f3f2e9] text-[#8b7940]' },
  error: { icon: 'info', color: 'bg-[#fff0e9] text-[#b9583e]' },
  loading: { icon: 'sprout', color: 'bg-[#edf4e8] text-leaf' },
}

export default function StatusPanel({ type = 'empty', title, description, action }) {
  const style = styles[type]
  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-center sm:p-9" role={type === 'error' ? 'alert' : 'status'}>
      <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${style.color}`}>
        {type === 'loading' ? <span className="animate-pulse"><Icon name={style.icon} size={23} /></span> : <Icon name={style.icon} size={23} />}
      </div>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
