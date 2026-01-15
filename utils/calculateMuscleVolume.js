import { useUserProfileStore } from "../ZustandStores/UserProfileStore";

export const calculateMuscleVolume = (planExercises = [], exercisesDB = []) => {
    const { bodyweight } = useUserProfileStore();
    
    const muscleVolumes = {};

    if (!Array.isArray(planExercises) || !Array.isArray(exercisesDB)) return muscleVolumes;

    planExercises.forEach(planExercise => {
        const fullExercise = exercisesDB.find(e => e.id === planExercise.id);

        const sets = Number(planExercise.sets);
        const reps = Number(planExercise.reps);
        const weight = Number(planExercise.weight) || 0;

        if (!Number.isFinite(sets) || !Number.isFinite(reps)) return;

        let effectiveWeight = 0;

        const hasBodyweight = Number.isFinite(fullExercise.bodyweightFactor);

        const hasExternalWeight = Number.isFinite(weight) && weight > 0;

        if (hasBodyweight) effectiveWeight = bodyweight * fullExercise.bodyweightFactor;
        if (hasExternalWeight) effectiveWeight += weight;
        if (!hasBodyweight && hasExternalWeight) effectiveWeight = weight;

        const volume = sets * reps * effectiveWeight;
        if (!Number.isFinite(volume) || volume <= 0) return;

        fullExercise.muscles.forEach(({ name, ratio }) => {
            if (!name || !Number.isFinite(ratio)) return;

            muscleVolumes[name] = (muscleVolumes[name] || 0) + volume * ratio;
        });
    });

    return muscleVolumes;
};