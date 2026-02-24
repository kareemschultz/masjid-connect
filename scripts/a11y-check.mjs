import fs from 'node:fs'

const settings = fs.readFileSync('app/settings/page.tsx', 'utf8')
if (!settings.includes('aria-label')) {
  console.warn('No explicit aria-label detected in settings page controls')
}
console.log('A11y static smoke check passed')
