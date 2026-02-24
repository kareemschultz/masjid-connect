import fs from 'node:fs'

const appCss = fs.readFileSync('app/globals.css', 'utf8')
if (!appCss.includes('--background') || !appCss.includes('--foreground')) {
  throw new Error('Theme tokens missing from app/globals.css')
}
console.log('Visual token smoke check passed')
