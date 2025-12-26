import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import baza from '../../baza.json';

const ExerciseCard = ({ exercise }) => {
    const [expanded, setExpanded] = useState(false);
    const exerciseData = baza.exercises[exercise.id];

    return (
        <View>
            <Text>{exercise.name}</Text>
            <Text>Sets: {exercise.sets}</Text>
            <Text>Reps: {exercise.reps}</Text>
            <Text>Weight: {exercise.weight}</Text>

            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text>{expanded ? 'Hide Instructions' : 'Show Instructions'}</Text>
            </TouchableOpacity>

            {expanded && (
                <View>
                    {exerciseData.instructions.map((inst) => (
                        <Text>{inst}</Text>
                    ))}
                </View>
            )}
        </View>
    )
}

export default ExerciseCard;