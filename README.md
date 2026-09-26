# Foundry & Flow

Foundry & Flow is a static kettlebell training, yoga, and everyday nutrition site for adults. Its hero artwork pairs a kettlebell and yoga mat in the site’s vintage poster style. Open `site/index.html` locally or serve the `site/` directory with any static server. The live site is at [wmcbay13.github.io/kb-training-site](https://wmcbay13.github.io/kb-training-site/).

## How the plan works

The profile selects experience level, goal, and two to five kettlebell days per week. The site stores that profile, session completion, and individual set checkmarks in browser `localStorage`. Height and weight are optional reference fields that accept typed units such as `5'8"`, `173 cm`, `175 lb`, or `80 kg`; they do not determine exercise loads or calorie targets. Each seven-day week is anchored to the date the profile was first saved. Exercise alternatives and bounded set or rep changes provide weekly variety, with every fourth week using easier volume. A weekly rhythm diagram and completion bars show the plan at a glance. Each prescribed set has its own checklist; session completion remains a separate choice.

## Movement and recovery guides

The Exercise Library covers all nine movements used in the plan, including their weekly variants. Workout names open the matching guide with setup cues, an easier option, a common mistake, and a link to a detailed external demonstration. Search by movement name or pattern. The yoga section includes six original human figure pose illustrations alongside the short and long recovery flows.

## Everyday food ideas

The nutrition section builds on the four everyday tips with flexible examples for breakfast, lunch, and dinner, plus snack and drink ideas. These are food combinations and prep cues rather than prescribed portions or a fixed menu. Sources include USDA MyPlate and CDC guidance on beverages.

## Display preferences

Use the Dark mode button in the header to switch between the original light palette and a dark palette. The site follows the system color preference on the first visit, then remembers a manual choice in browser storage. The theme is applied before the page renders to avoid a bright flash.

## Deployment

The GitHub Actions workflow in `.github/workflows/pages.yml` publishes `site/` to GitHub Pages after every push to `main`, including pull request merges. In repository Settings → Pages, select **GitHub Actions** as the build and deployment source.

## Content sources

- [ACE Fitness kettlebell introduction](https://www.acefitness.org/resources/pros/expert-articles/5269/how-to-get-started-with-kettlebells/)
- [WHO physical activity guidance](https://www.who.int/publications/i/item/9789240014886)
- [USDA MyPlate](https://www.myplate.gov/)
- [USDA MyPlate healthy snacking](https://www.myplate.gov/sites/default/files/2024-06/TipSheet-12-Healthy-Snacking-With-MyPlate.pdf)
- [CDC water and healthier drinks](https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html)
- [ACE Fitness two-handed kettlebell swing](https://www.acefitness.org/continuing-education/certified/january-2025/8788/the-ace-do-it-better-series-the-two-handed-kettlebell-swing/)
- [Yoga Journal pose library](https://www.yogajournal.com/poses/)
