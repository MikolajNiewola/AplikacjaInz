import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useExerciseStore } from '../../ZustandStores/ExerciseStore';

const ExerciseCard = ({ exercise }) => {
    const { exercisesDB, fetchExercises } = useExerciseStore();

    useEffect(() => {
        fetchExercises();
    }, []);
    
    const [expanded, setExpanded] = useState(false);
    const exerciseData = exercisesDB[exercise.id];
    return (
        <View>
            <Text>{exercise.name}</Text>
            <Text>Serie: {exercise.sets}</Text>
            <Text>Powtórzenia: {exercise.reps}</Text>
            <Text>Ciężar: {exercise.weight}</Text>

            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text>{expanded ? 'Ukryj instrukcje' : 'Pokaż instrukcje'}</Text>
            </TouchableOpacity>

            {expanded && (
                <View>
                    {exerciseData.instructions.map((inst, key) => (
                        <Text key={key}>{inst}</Text>
                    ))}
                </View>
            )}
        </View>
    )
}

export default ExerciseCard;