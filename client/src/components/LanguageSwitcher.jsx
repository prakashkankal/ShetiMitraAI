import { Icon } from './Icons.jsx'
import { useLanguage, useTranslation } from '../i18n.jsx'

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage()
  const t = useTranslation()

  return (
    <label className={`site-language-picker ${className}`.trim()}>
      <Icon name="globe" size={17} />
      <select
        aria-label={t('language')}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="mr">{t('marathi')}</option>
        <option value="hi">{t('hindi')}</option>
        <option value="en">{t('english')}</option>
      </select>
      <span aria-hidden="true">⌄</span>
    </label>
  )
}
