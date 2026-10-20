import PageHeading from '../components/PageHeading.jsx'
import StatusPanel from '../components/StatusPanel.jsx'
import { useTranslation } from '../i18n.jsx'

export default function GuidancePage() {
  const t = useTranslation()
  return <><PageHeading eyebrow="ShetiMitra AI" title={t('guidancePageTitle')} description={t('guidancePageCopy')} /><StatusPanel type="empty" title={t('guidanceEmpty')} description={t('guidanceEmptyCopy')} /></>
}
