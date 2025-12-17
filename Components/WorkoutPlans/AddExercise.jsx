import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';

const AddExercise = ({ exercise, onChange }) => {    
    const [reps, setReps] = useState(exercise?.reps || 5);
    const [sets, setSets] = useState(exercise?.sets || 3);
    const [weight, setWeight] = useState(
        exercise?.weight !== undefined ? String(exercise.weight) : ''
    );

    const incRepCounter = () => { setReps(reps + 1); }
    const decRepCounter = () => { if (reps > 1) setReps(reps - 1); }
    const incSetCounter = () => { setSets(sets + 1); }
    const decSetCounter = () => { if (sets > 1) setSets(sets - 1); }

    useEffect(() => {
        if (onChange) {
            const numericWeight = weight === '' ? 0 : Number(weight)
            onChange({ reps, sets, weight: numericWeight });
        }
    }, [reps, sets, weight]);

    const sanitizeNumber = (text) => {
        let cleaned = String(text).replace(/[^0-9.]/g, '');

        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }

        let [intPart, decimalPart] = cleaned.split('.');

        if (intPart.length > 1) {
            intPart = intPart.replace(/^0+/, '');
            if (intPart === '') intPart = '0';
        }

        if (decimalPart?.length > 2) {
            decimalPart = decimalPart.slice(0, 2);
        }

        return decimalPart !== undefined
            ? `${intPart}.${decimalPart}`
            : intPart;
    };

    const handleWeightChange = (text) => {
        const sanitized = sanitizeNumber(text);
        setWeight(sanitized);
    }

    return (
        <View>
            <Text>{exercise.name}</Text>

            <TouchableOpacity onPress={decRepCounter}><Text> - </Text></TouchableOpacity> 
            <Text>Reps: {reps}</Text> 
            <TouchableOpacity onPress={incRepCounter}><Text> + </Text></TouchableOpacity>

            <TouchableOpacity onPress={decSetCounter}><Text> - </Text></TouchableOpacity> 
            <Text>Sets: {sets}</Text> 
            <TouchableOpacity onPress={incSetCounter}><Text> + </Text></TouchableOpacity>

            <Text>Weight: </Text>
            <TextInput 
                value={weight}
                placeholder='0'
                keyboardType="decimal-pad"
                inputMode="decimal"
                contextMenuHidden={true}
                onChangeText={handleWeightChange}
            />
        </View>
    );
}

export default AddExercise;