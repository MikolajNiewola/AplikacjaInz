export const calculateMuscleVolume = (planExercises = [], exercisesDB = []) => {
    const muscleVolumes = {};

    if (!Array.isArray(planExercises) || !Array.isArray(exercisesDB)) {
        return muscleVolumes;
    }

    planExercises.forEach(planExercise => {
        const fullExercise = exercisesDB.find(e => e.id === planExercise.id);

        const sets = Number(planExercise.sets);
        const reps = Number(planExercise.reps);
        const weight = Number(planExercise.weight);

        if (!Number.isFinite(sets) || !Number.isFinite(reps)) return;

        const effectiveWeight =
            Number.isFinite(weight) && weight > 0
                ? weight
                : Number.isFinite(fullExercise.bodyweightFactor)
                    ? fullExercise.bodyweightFactor
                    : 0;

        const volume = sets * reps * effectiveWeight;
        if (!Number.isFinite(volume) || volume <= 0) return;

        fullExercise.muscles.forEach(({ name, ratio }) => {
            if (!name || !Number.isFinite(ratio)) return;

            muscleVolumes[name] =
                (muscleVolumes[name] || 0) + volume * ratio;
        });
    });

    return muscleVolumes;
};