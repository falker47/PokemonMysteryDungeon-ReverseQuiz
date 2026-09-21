import { readFile } from 'node:fs/promises';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

const questions = await readJson('../public/data/questions_db_it.json');
const starters = await readJson('../public/data/starters_map.json');

const expectedCounts = {
  'Red/Blue Rescue Team': 56,
  'Explorers of Time/Darkness': 64,
  'Explorers of Sky': 64
};

for (const [game, expected] of Object.entries(expectedCounts)) {
  const list = questions[game];
  if (!Array.isArray(list)) throw new Error(`Missing question set: ${game}`);
  if (list.length !== expected) {
    throw new Error(`${game}: expected ${expected} scoring questions, found ${list.length}`);
  }

  for (const question of list) {
    if (!question.text || !Array.isArray(question.answers) || question.answers.length === 0) {
      throw new Error(`${game}: malformed question ${question.id ?? '(no id)'}`);
    }
    for (const answer of question.answers) {
      if (Object.hasOwn(answer.points || {}, 'gender')) {
        throw new Error(`${game}: gender answer leaked into scoring data at question ${question.id}`);
      }
    }
  }
}

const rescue = questions['Red/Blue Rescue Team'];
const rescueCategoryCounts = rescue.reduce((acc, question) => {
  acc[question.category] = (acc[question.category] || 0) + 1;
  return acc;
}, {});

const expectedRescueCategories = {
  Hardy: 4,
  Docile: 4,
  Brave: 5,
  Jolly: 4,
  Impish: 4,
  Naive: 4,
  Timid: 4,
  Hasty: 4,
  Sassy: 4,
  Calm: 4,
  Relaxed: 4,
  Lonely: 4,
  Quirky: 4,
  Miscellaneous: 3
};

for (const [category, expected] of Object.entries(expectedRescueCategories)) {
  if (rescueCategoryCounts[category] !== expected) {
    throw new Error(`Rescue Team ${category}: expected ${expected}, found ${rescueCategoryCounts[category] ?? 0}`);
  }
}

if (!rescue.some(q => q.text === 'Can you sincerely thank someone when you feel grateful?')) {
  throw new Error('Rescue Team Sassy question #4 is missing');
}

for (const [pokemon, gameMap] of Object.entries(starters)) {
  for (const [gameId, genderMap] of Object.entries(gameMap)) {
    const hasMale = Array.isArray(genderMap.Male) && genderMap.Male.length > 0;
    const hasFemale = Array.isArray(genderMap.Female) && genderMap.Female.length > 0;
    if (!hasMale && !hasFemale) {
      throw new Error(`${pokemon}/${gameId}: starter mapping has no valid gender/nature`);
    }
  }
}

console.log('PMD data validation passed.');
