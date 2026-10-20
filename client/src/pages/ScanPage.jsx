import PageHeading from '../components/PageHeading.jsx'
import StatusPanel from '../components/StatusPanel.jsx'
import { useTranslation } from '../i18n.jsx'

export default function ScanPage() {
  const t = useTranslation()
  return <><PageHeading eyebrow="ShetiMitra AI" title={t('scanPageTitle')} description={t('scanPageCopy')} /><StatusPanel type="unavailable" title={t('scanUnavailable')} description={t('scanUnavailableCopy')} /></>
}
