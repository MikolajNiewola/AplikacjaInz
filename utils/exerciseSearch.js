export const levenshtein = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, () =>
        Array(a.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
        matrix[j][i] =
            a[i - 1] === b[j - 1]
            ? matrix[j - 1][i - 1]
            : Math.min(
                matrix[j - 1][i] + 1,
                matrix[j][i - 1] + 1,
                matrix[j - 1][i - 1] + 1
                );
        }
    }

    return matrix[b.length][a.length];
};

export const fuzzyMatch = (query, text, maxDistance = 2) => {
    if (!query || !text) return false;

    const q = query.toLowerCase();
    const t = text.toLowerCase();

    if (t.includes(q)) return true;

    return t.split(' ').some(word =>
        levenshtein(q, word) <= maxDistance
    );
};

export const filterExercises = (exercises, query) => {
    if (!query || query.length < 3) return exercises;

    return exercises.filter(ex =>
        fuzzyMatch(query, ex.name) ||
        ex.muscles?.some(m => fuzzyMatch(query, m.name)) ||
        fuzzyMatch(query, ex.category) ||
        fuzzyMatch(query, ex.type) ||
        fuzzyMatch(query, ex.difficulty) ||
        ex.equipment?.some(eq => fuzzyMatch(query, eq)) ||
        fuzzyMatch(query, ex.movement)
    );
};