import PageHeading from '../components/PageHeading.jsx'
import StatusPanel from '../components/StatusPanel.jsx'
import { useTranslation } from '../i18n.jsx'

export default function WeatherPage() {
  const t = useTranslation()
  return <><PageHeading eyebrow="ShetiMitra AI" title={t('weatherPageTitle')} description={t('weatherPageCopy')} /><StatusPanel type="unavailable" title={t('weatherUnavailable')} description={t('weatherUnavailableCopy')} /></>
}
