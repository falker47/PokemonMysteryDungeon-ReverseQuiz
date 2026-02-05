
/**
 * Loads the starters map and questions database from the public folder.
 */
export async function loadData() {
    const [startersRes, questionsRes] = await Promise.all([
        fetch('/data/starters_map.json'),
        fetch('/data/questions_db_it.json')
    ]);

    const starters = await startersRes.json();
    const questions = await questionsRes.json();

    return { starters, questions };
}

/**
 * Normalizes game keys to match between starters map and questions db if necessary.
 * Or returns a mapping of display names to keys.
 */
export const GAME_VERSIONS = [
    { id: 'rescue_team', label: 'Red/Blue Rescue Team', dbKey: 'Red/Blue Rescue Team' },
    { id: 'explorers_time_darkness', label: 'Explorers of Time/Darkness', dbKey: 'Explorers of Time/Darkness' },
    { id: 'explorers_sky', label: 'Explorers of Sky', dbKey: 'Explorers of Sky' }
];

/**
 * Gets the target nature for a specific combination.
 * @returns {string | null} The target nature or null if not found.
 */
export function getTargetNature(startersMap, gameId, pokemonName, gender) {
    if (!startersMap[pokemonName]) return null;
    const gameData = startersMap[pokemonName][gameId];
    if (!gameData) return null;

    // gameData is { Male: ["Nature"], Female: ["Nature"] }
    // or sometimes arrays
    const natures = gameData[gender];
    if (Array.isArray(natures) && natures.length > 0) {
        return natures[0];
    }
    return null;
}

/**
 * Analyzes questions to find the best answers for the target nature.
 */
export function solveQuiz(questionsDb, gameDbKey, targetNature) {
    const gameQuestions = questionsDb[gameDbKey] || [];

    return gameQuestions.map(q => {
        // Find answers that give points to targetNature
        const answersWithImpact = q.answers.map(a => {
            const points = a.points[targetNature] || 0;
            return { ...a, score: points };
        });

        // Find max positive score
        const maxScore = Math.max(...answersWithImpact.map(a => a.score));

        return {
            ...q,
            answers: answersWithImpact.map(a => ({
                ...a,
                isBest: maxScore > 0 && a.score === maxScore, // ONLY highlight if it actually gives points
                isFallback: maxScore <= 0 && a.score === 0 // If no points available, prefer neutral
            }))
        };
    }).filter(q => {
        // Filter out questions that have NO impact (all answers 0) unless we want to show all?
        // User said "show EXACTLY which answers to choose".
        // If a question has NO 'Hardy' points in ANY answer, it's irrelevant? 
        // OR we should pick the formatted logic.
        // Let's keep all valid questions but maybe flag 'irrelevant' ones if maxScore is 0.
        return true;
    });
}
