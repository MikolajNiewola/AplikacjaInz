export const calculateMusclePreview = (exercises = [], exercisesDB = []) => {
    const result = {};

    exercises.forEach(ex => {
        const full = exercisesDB.find(e => e.id === ex.id);
        if (!full?.muscles) return;

        full.muscles.forEach(m => {
            result[m.name] = Math.max(result[m.name] || 0, m.ratio);
        });
    });

    return result;
};