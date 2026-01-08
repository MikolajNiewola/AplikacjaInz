import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MuscleMapSVG from '../Components/MuscleMap/MuscleMapSVG.jsx';
import { frontLayers, rearLayers } from '../Components/MuscleMap/MuscleMapLayers.jsx';
import { useExerciseStore } from '../ZustandStores/ExerciseStore';
import { calculateMuscleVolume } from '../utils/calculateMuscleVolume.js';
import { calculateMusclePreview } from '../utils/calculateMusclePreview.js';
import { theme } from '../Themes/index';

const MuscleMap = ({ route })  => {
    const [view, setView] = useState('front');
    const toggleView = () => setView((prev) => (prev === 'front' ? 'rear' : 'front'));
    
    const { exercisesDB, fetchExercises } = useExerciseStore();

    useEffect(() => {
        fetchExercises();
    }, []);

    const preview = route.params?.preview ?? false;

    const planExercises = route.params.exercises || [];
    const muscleVolumes = preview 
        ? calculateMusclePreview(planExercises, exercisesDB)
        : calculateMuscleVolume(planExercises, exercisesDB);

    const currentLayers = view === 'front' ? frontLayers : rearLayers;

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MuscleMapSVG layers={currentLayers} muscleVolumes={muscleVolumes} preview={preview} />
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