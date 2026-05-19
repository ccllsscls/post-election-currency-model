# Post-Election Currency Tracker

An interactive data application analysing how political regime change affects currency markets, using Poland's 2023 election as a template to project Hungary's 2026 post-election HUF trajectory.

🔗 **Live demo:** https://ccllsscls.github.io/post-election-currency-model/

---

## What it does

- Plots EUR/PLN trend after Poland's October 2023 pro-EU election win (+8% in 12 months)
- Plots EUR/HUF actual movement after Hungary's April 2026 election
- Projects HUF forward trajectory using PLN as a template
- Lets users adjust three parameters: PLN weight, EU fund unlock speed, rate cut probability
- Includes an "How it was built" panel documenting the AI-assisted development process

## Tech stack

- React + TypeScript + Vite
- Custom canvas chart 
- GitHub Actions CI/CD → GitHub Pages

## Built with AI-assisted development

This project was built using Claude (Sonnet 4) as first experiment — from architecture design to component code to deployment configuration. The "How it was built" tab in the app documents the prompts, timeline, and lessons learned.

Time from concept to live URL: ~3 days.
