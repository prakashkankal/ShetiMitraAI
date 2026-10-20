import PageHeading from '../components/PageHeading.jsx'
import StatusPanel from '../components/StatusPanel.jsx'
import { useTranslation } from '../i18n.jsx'

export default function HistoryPage() {
  const t = useTranslation()
  return <><PageHeading eyebrow="ShetiMitra AI" title={t('historyPageTitle')} description={t('historyPageCopy')} /><StatusPanel type="empty" title={t('historyEmpty')} description={t('historyEmptyCopy')} /></>
}
