import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';

const AddExercise = ({ exercise, onChange }) => {    
    const [reps, setReps] = useState(5);
    const [sets, setSets] = useState(3);
    const [weight, setWeight] = useState(0);

    const incRepCounter = () => { setReps(reps + 1); }
    const decRepCounter = () => { if (reps > 0) setReps(reps - 1); }
    const incSetCounter = () => { setSets(sets + 1); }
    const decSetCounter = () => { if (sets > 0) setSets(sets - 1); }

    useEffect(() => {
        if (onChange) onChange({ reps, sets, weight });
    }, [reps, sets, weight]);

    return (
        <View>
            <Text>{exercise.name}</Text>

            <TouchableOpacity onPress={decRepCounter}><Text> - </Text></TouchableOpacity> 
            <Text>Reps: {reps}</Text> 
            <TouchableOpacity onPress={incRepCounter}><Text> + </Text></TouchableOpacity>

            <TouchableOpacity onPress={decSetCounter}><Text> - </Text></TouchableOpacity> 
            <Text>Sets: {sets}</Text> 
            <TouchableOpacity onPress={incSetCounter}><Text> + </Text></TouchableOpacity>

            <TextInput 
                placeholder="Weight"
                keyboardType="numeric"
                onChangeText={(input) => setWeight(Number(input))}
            />
        </View>
    );
}

export default AddExercise;