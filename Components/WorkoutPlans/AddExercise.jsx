import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

const AddExercise = ({ exercise, onChange, onRemove }) => {    
    const [reps, setReps] = useState(exercise?.reps || 5);
    const [sets, setSets] = useState(exercise?.sets || 3);
    const [weight, setWeight] = useState(exercise?.weight !== undefined ? String(exercise.weight) : '');

    const decRepCounter = () => { setReps(Math.max(reps - 1, 1)); }
    const incRepCounter = () => { setReps(reps + 1); }
    
    const decSetCounter = () => { setSets(Math.max(sets - 1, 1)); }
    const incSetCounter = () => { setSets(sets + 1); }

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

        return decimalPart !== undefined ? `${intPart}.${decimalPart}` : intPart;
    };

    const handleWeightChange = (text) => {
        setWeight(sanitizeNumber(text));
    }

    return (
        <View style={styles.container}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>

                <TouchableOpacity onPress={onRemove}>
                    <Text style={styles.exerciseWarning}>Usuń ćwiczenie</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.exerciseRow}>

                <View style={styles.exerciseColumn}>
                    <Text>Serie:</Text>
                    <View style={styles.exerciseButtonHolder}>
                        <TouchableOpacity onPress={decSetCounter} style={styles.exerciseButton}><Text style={styles.exerciseButtonText}>-</Text></TouchableOpacity>
                        <Text style={styles.exerciseCounter}>{sets}</Text>
                        <TouchableOpacity onPress={incSetCounter} style={styles.exerciseButton}><Text style={styles.exerciseButtonText}>+</Text></TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.exerciseColumn}>
                    <Text>Powtórzenia:</Text>
                    <View style={styles.exerciseButtonHolder}>
                        <TouchableOpacity onPress={decRepCounter} style={styles.exerciseButton}><Text style={styles.exerciseButtonText}>-</Text></TouchableOpacity>
                        <Text style={styles.exerciseCounter}>{reps}</Text>
                        <TouchableOpacity onPress={incRepCounter} style={styles.exerciseButton}><Text style={styles.exerciseButtonText}>+</Text></TouchableOpacity>
                    </View>
                </View>

                <View style={styles.exerciseColumn}>
                    <Text>Ciężar:</Text>
                    <View style={styles.exerciseButtonHolder}>
                        <TextInput
                            value={weight}
                            placeholder='0'
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            contextMenuHidden={true}
                            onChangeText={handleWeightChange}
                            style={styles.exerciseInput}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1, 
        borderColor: '#ccc', 
        paddingHorizontal: 5,
        paddingVertical: 15,
        marginVertical: 5,
    },

    exerciseHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 15,
    },

    exerciseName: { 
        fontWeight: 'bold', 
        fontSize: 16,
    },

    exerciseWarning: {
        color: 'red', 
        fontSize: 12, 
        textAlign: 'center',
        padding: 3,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 5,
    },

    exerciseRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 5,
    },

    exerciseColumn: {
        alignItems: 'center',
    },

    exerciseButtonHolder: { 
        flexDirection: 'row', 
        alignItems: 'center',
        marginTop: 5,
    },

    exerciseButton: {
        borderWidth: 1, 
        borderColor: '#ccc', 
        paddingHorizontal: 10, 
        paddingVertical: 5,
    },

    exerciseButtonText: {
        fontSize: 18,
    },

    exerciseCounter: {
        marginHorizontal: 5,
        fontSize: 16,
        minWidth: 30,
        textAlign: 'center',
    },

    exerciseInput: {
        textAlign: 'center', 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 0,
        width: 60,
        height: 35,
    },
});

export default AddExercise;