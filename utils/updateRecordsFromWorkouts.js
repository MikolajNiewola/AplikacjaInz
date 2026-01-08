export const calculate1RM = (weight, reps) => {
    return weight * (1 + reps / 30);
};

export const updateRecordsFromWorkouts = (
    existingRecords = {},
    workouts = [],
    exercisesDB = []
) => {
    const records = { ...existingRecords };

    workouts.forEach(workout => {
        workout.exercises.forEach(ex => {
            const full = exercisesDB.find(e => e.id === ex.id);
            if (!full) return;

            const reps = Number(ex.reps);
            const sets = Number(ex.sets);
            const weight = Number(ex.weight) || 0;

            if (!Number.isFinite(reps) || !Number.isFinite(sets)) return;

            if (!records[ex.id]) {
                records[ex.id] = {
                    id: ex.id,
                    name: full.name,
                    isBodyweight: full.bodyweightFactor != null,
                    maxReps: 0,
                    maxWeight: 0,
                    best1RM: 0,
                };
            }

            const r = records[ex.id];

            r.maxReps = Math.max(r.maxReps, reps);

            if (weight > 0) {
                r.maxWeight = Math.max(r.maxWeight, weight);
            }

            if (!r.isBodyweight && weight > 0 && reps > 0) {
                const oneRM = calculate1RM(weight, reps);
                if (!r.best1RM || oneRM > r.best1RM) {
                    r.best1RM = oneRM;
                    r.best1RMSet = {
                        reps,
                        weight,
                    };
                }
            }
        });
    });

    return records;
};
