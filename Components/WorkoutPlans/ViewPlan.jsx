import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Touchable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseCard from './ExerciseCard';
import { theme } from '../../Themes/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightLong } from '@fortawesome/free-solid-svg-icons/faRightLong';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons/faLeftLong';

const ViewPlan = ({ route }) => {
    const navigation = useNavigation();
    const { plan: initialPlan } = route.params;

    const [plan, setPlan] = useState(initialPlan);
    const [videoExercise, setVideoExercise] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useFocusEffect(
        useCallback(() => {
        const loadPlan = async () => {
            try {
                const stored = await AsyncStorage.getItem('workouts');
                const parsed = JSON.parse(stored);

                const updatedPlan = parsed.find(p => p.id === initialPlan.id);
                if (updatedPlan) setPlan(updatedPlan);
                if (currentIndex >= updatedPlan.exercises.length) setCurrentIndex(0);
            } catch (e) {
                console.error('Error loading plan to viewer:', e);
            }
        };

        loadPlan();
        }, [])
    );

    const viewMuscleMap = () => {
        navigation.navigate('Muscle Map', { exercises: plan.exercises });
    };

    const handleEdit = () => {
        navigation.navigate('Create Plan', { plan });
    };

    const handleDelete = () => {
        Alert.alert("Usuwanie planu", "Czy napewno chcesz usunąć ten plan?", [
            {
                    text: "Anuluj",
            },
            {
                text: "USUŃ",
                onPress: async () => {
                try {
                    const plans = await AsyncStorage.getItem('workouts');
                    
                    const parsedPlans = JSON.parse(plans);

                    const filtered = parsedPlans.filter(p => p.id !== plan.id);

                    await AsyncStorage.setItem('workouts', JSON.stringify(filtered));
                    setTimeout(() => {
                        navigation.goBack();
                    }, 0);
                    
                    } catch (e) {
                        console.error('Error deleting a workout: ', e);
                    }
                }
            }
        ])
    };

    const next = () => {
        if (currentIndex < plan.exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    }

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{plan.name}</Text>

                <View style={styles.headerActions}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit()}
                >
                    <Text style={styles.editText}>Edytuj</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleDelete}
                >
                    <Text style={styles.deleteText}>Usuń</Text>
                </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => viewMuscleMap()}
            >
                <Text style={styles.mapText}>Sprawdź mapę mięśni</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Ćwiczenia</Text>

        
            <View style={styles.exerciseCardWrapper}>
                <View style={styles.carouselHeader}>
                    <TouchableOpacity
                        onPress={prev}
                        disabled={currentIndex === 0}
                        style={[ styles.navBtn, currentIndex === 0 && styles.navBtnDisabled ]}
                    >
                        <FontAwesomeIcon icon={faLeftLong} color={theme.colors.accent} />
                    </TouchableOpacity>
                    <Text style={styles.counter}>
                        {currentIndex + 1} / {plan.exercises.length}
                    </Text>
                    <TouchableOpacity
                        onPress={next}
                        disabled={currentIndex === plan.exercises.length - 1}
                        style={[ styles.navBtn, currentIndex === plan.exercises.length - 1 && styles.navBtnDisabled ]}
                    >
                        <FontAwesomeIcon icon={faRightLong} color={theme.colors.accent} />  
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 0 }}
                    showsVerticalScrollIndicator={false}
                >
                    <ExerciseCard 
                        exercise={plan.exercises[currentIndex]}
                        onShowVideo={(exercise) => setVideoExercise(exercise)} 
                    />
                </ScrollView>
            </View>

            {videoExercise && (
                <View style={styles.videoOverlay}>
                    <TouchableOpacity
                        style={styles.videoBackdrop}
                        activeOpacity={1}
                        onPress={() => setVideoExercise(null)}
                    />

                    <View style={styles.videoModal}>
                        <Text style={styles.videoTitle}>
                            {videoExercise.name}
                        </Text>

                        <FastImage
                            source={{ uri: videoExercise.video }}
                            style={styles.video}
                            resizeMode={FastImage.resizeMode.contain}
                        />

                        <TouchableOpacity
                            style={styles.videoCloseBtn}
                            onPress={() => setVideoExercise(null)}
                        >
                            <Text style={styles.videoCloseText}>Zamknij</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },

    header: {
        marginBottom: theme.spacing.md,
    },

    title: {
        color: theme.colors.textPrimary,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: theme.spacing.sm,
    },

    headerActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },

    editBtn: {
        backgroundColor: theme.colors.surfaceSoft,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    editText: {
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },

    deleteBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.danger,
    },

    deleteText: {
        color: theme.colors.danger,
        fontWeight: '600',
    },

    mapBtn: {
        marginBottom: theme.spacing.md,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
    },

    mapText: {
        color: '#fff',
        fontWeight: '700',
    },

    sectionTitle: {
        color: theme.colors.textMuted,
        fontSize: 13,
        marginBottom: theme.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    exerciseCardWrapper: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        // marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },

    carouselHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.surfaceSoft,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderSoft,
        zIndex: 1,
    },

    navBtn: {
        width: 56,
        height: 36,
        borderRadius: 6,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    navBtnDisabled: {
        opacity: 0.3,
    },

    navText: {
        color: theme.colors.accent,
        fontSize: 32,
        fontWeight: '800',
        textAlignVertical: 'center',
    },

    counter: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    videoModal: {
        width: '90%',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    videoTitle: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 16,
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },

    video: {
        width: '100%',
        height: 260,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceSoft,
    },

    videoCloseBtn: {
        marginTop: theme.spacing.md,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceSoft,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    videoCloseText: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
    },

});


export default ViewPlan;