import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MuscleMapSVG from '../Components/MuscleMap/MuscleMapSVG.jsx';
import { frontLayers, rearLayers } from '../Components/MuscleMap/MuscleMapLayers.jsx';
import { useExerciseStore } from '../ZustandStores/ExerciseStore';
import { theme } from '../Themes/index';

const aggregateMuscleLoads = (exercises) => {
    const { exercisesDB, fetchExercises } = useExerciseStore();

    useEffect(() => {
        fetchExercises();
    }, []);
    const aggregated = {};

    exercises.forEach((exercise) => {
        exercisesDB[exercise.id].muscle_group.forEach(({ name, load }) => {
            aggregated[name] = (aggregated[name] || 0) + (load || 0);
        });
    });

    return aggregated;
};

const MuscleMap = ({ route })  => {
    const [view, setView] = useState('front');
    const toggleView = () => setView((prev) => (prev === 'front' ? 'rear' : 'front'));

    const exercisesParam = route.params.exercises;
    const muscleLoads = aggregateMuscleLoads(exercisesParam);
    const currentLayers = view === 'front' ? frontLayers : rearLayers;

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MuscleMapSVG layers={currentLayers} muscleLoads={muscleLoads} />
            </View>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
                <Text style={styles.toggleButtonText}>Pokaż {view === 'front' ? 'tył' : 'przód'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceSoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        width: "100%",
        height: 64,
        marginTop: theme.spacing.sm,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.accent,
        borderRadius: 16,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        justifyContent: 'center'
    },
    toggleButtonText: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default MuscleMap;