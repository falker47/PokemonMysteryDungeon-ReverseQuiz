
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

const SKY_OPENING_BONUS_NATURES = {
    Male: ['Relaxed', 'Hasty', 'Sassy'],
    Female: ['Relaxed', 'Jolly']
};

/**
 * In Explorers of Sky, answering "Yes" to the opening Time/Darkness question
 * adds +4 to the new-starter natures for the selected gender.
 * Returns the safer answer for steering the quiz toward the selected target.
 */
export function getSkyOpeningRecommendation(gameId, targetNature, gender) {
    if (gameId !== 'explorers_sky' || !targetNature) return null;

    const boostedNatures = SKY_OPENING_BONUS_NATURES[gender] || [];
    return {
        answer: boostedNatures.includes(targetNature) ? 'Yes' : 'No',
        points: 4,
        boostedNatures
    };
}

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
        // Score each answer only against the selected target nature.
        const answersWithImpact = q.answers.map(a => {
            const points = a.points[targetNature] || 0;
            return { ...a, score: points };
        });

        const maxScore = Math.max(...answersWithImpact.map(a => a.score));

        return {
            ...q,
            answers: answersWithImpact.map(a => ({
                ...a,
                // Highlight locally optimal answers without implying a guaranteed final quiz result.
                isBest: maxScore > 0 && a.score === maxScore,
                isFallback: maxScore <= 0 && a.score === 0
            }))
        };
    });
}
