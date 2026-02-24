# PWA Performance Audit Plan

This repository now includes `.github/workflows/lighthouse.yml` for Lighthouse runs on PRs/workflow dispatch.

## Scope
- Home page
- Iftaar page
- Settings page

## Baseline vs after
- Capture first run artifacts as baseline.
- Compare LCP/CLS/INP/Performance score after feature changes.
- Track regressions and include artifact links in PR notes.
