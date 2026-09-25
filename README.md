# Foundry & Flow

Foundry & Flow is a static kettlebell training, yoga, and everyday nutrition site for adults. Open `site/index.html` locally or serve the `site/` directory with any static server. The live site is at [wmcbay13.github.io/kb-training-site](https://wmcbay13.github.io/kb-training-site/).

## How the plan works

The profile selects experience level, goal, and two to five kettlebell days per week. The site stores that profile, session completion, and individual set checkmarks in browser `localStorage`. Height and weight are optional reference fields that accept typed units such as `5'8"`, `173 cm`, `175 lb`, or `80 kg`; they do not determine exercise loads or calorie targets. Each seven-day week is anchored to the date the profile was first saved. Exercise alternatives and bounded set or rep changes provide weekly variety, with every fourth week using easier volume. A weekly rhythm diagram and completion bars show the plan at a glance. Each prescribed set has its own checklist; session completion remains a separate choice.

## Movement and recovery guides

The Exercise Library covers all nine movements used in the plan, including their weekly variants. Workout names open the matching guide with setup cues, an easier option, a common mistake, and a link to a detailed external demonstration. Search by movement name or pattern. The yoga section includes six original, simplified pose illustrations alongside the short and long recovery flows.

## Deployment

The GitHub Actions workflow in `.github/workflows/pages.yml` publishes `site/` to GitHub Pages after every push to `main`, including pull request merges. In repository Settings → Pages, select **GitHub Actions** as the build and deployment source.

## Content sources

- [ACE Fitness kettlebell introduction](https://www.acefitness.org/resources/pros/expert-articles/5269/how-to-get-started-with-kettlebells/)
- [WHO physical activity guidance](https://www.who.int/publications/i/item/9789240014886)
- [USDA MyPlate](https://www.myplate.gov/)
- [ACE Fitness two-handed kettlebell swing](https://www.acefitness.org/continuing-education/certified/january-2025/8788/the-ace-do-it-better-series-the-two-handed-kettlebell-swing/)
- [Yoga Journal pose library](https://www.yogajournal.com/poses/)
