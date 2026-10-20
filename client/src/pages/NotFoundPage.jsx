import { Link } from 'react-router-dom'
import StatusPanel from '../components/StatusPanel.jsx'
import { useTranslation } from '../i18n.jsx'

export default function NotFoundPage() {
  const t = useTranslation()
  return <StatusPanel type="error" title="404" description={t('errorCopy')} action={<Link to="/" className="inline-flex min-h-11 items-center rounded-xl bg-forest px-4 text-sm font-semibold text-white">{t('backHome')}</Link>} />
}
