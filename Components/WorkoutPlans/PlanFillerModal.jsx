import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { theme } from '../../Themes/index';
import { useExerciseStore } from '../../ZustandStores/ExerciseStore'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

export const PlanFillerModal = ({ currentExercises, maxExercises = 9, onAddExercises }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [suggestedExercises, setSuggestedExercises] = useState([]);

    const { exercisesDB } = useExerciseStore();

    const priorityMuscles = ['czworoglowy', 'posladki', 'lydki', 'piersiowy', 'najszerszy', 'biceps', 'triceps'];

    const fillPlan = () => {
        const muscleScore = {};

        currentExercises.forEach(ex => {
            const full = exercisesDB.find(e => e.id === ex.id);
            if (!full) return;

            full.muscles.forEach(m => {
                muscleScore[m.name] = (muscleScore[m.name] || 0) + m.ratio;
            });
        });

        const musclesByNeed = [...priorityMuscles].sort(
            (a,b) => (muscleScore[a] || 0) - (muscleScore[b] || 0)
        );

        let availableExercises = exercisesDB.filter(ex => !currentExercises.some(e => e.id === ex.id));

        const suggestions = [];

        for (const muscle of musclesByNeed) {
            if (currentExercises.length + suggestions.length >= maxExercises) break;

            const candidates = availableExercises.filter(ex => ex.muscles.some(m => m.name === muscle));

            if (!candidates.length) continue;

            const compound = candidates.filter(c => c.category === 'Wielostawowe');
            const pool = compound.length ? compound : candidates;

            const chosen = pool[Math.floor(Math.random() * pool.length)];

            suggestions.push(chosen);

            availableExercises = availableExercises.filter(e => e.id !== chosen.id);
        }

        if (!suggestions.length) {
            Alert.alert('Plan jest pełny', 'Nie ma brakujących ćwiczeń do dodania.');
            return;
        }

        setSuggestedExercises(suggestions);
        setModalVisible(true);
    };

    const addExercise = (exercise) => {
        onAddExercises([exercise]);
        setSuggestedExercises(prev => prev.filter(e => e.id !== exercise.id));
    };

    const addAll = () => {
        onAddExercises(suggestedExercises);
        setModalVisible(false);
    };

     return (
        <View style={{ marginBottom: theme.spacing.md }}>
            <TouchableOpacity style={styles.addBtn} onPress={fillPlan}>
                <Text style={styles.addText}>Uzupełnij plan</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <FontAwesomeIcon icon={faXmark} size={20} color={theme.colors.textMuted} />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Proponowane ćwiczenia</Text>

                        <ScrollView style={styles.scrollArea}>
                            {suggestedExercises.map(ex => (
                                <TouchableOpacity key={ex.id} style={styles.exerciseItem} onPress={() => addExercise(ex)}>
                                    <Text style={styles.exerciseText}>{ex.name}</Text>
                                    <Text style={styles.exerciseHint}>Kliknij, aby dodać</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.accent }]} onPress={addAll}>
                                <Text style={styles.modalBtnText}>Dodaj wszystkie</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.surface }]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.modalBtnText, { color: theme.colors.textPrimary }]}>Anuluj</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: theme.colors.surfaceSoft,
        borderRadius: 10,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },
    addText: {
        color: theme.colors.accent,
        fontWeight: '700',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    closeBtn: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        padding: 6,
        zIndex: 10,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },

    scrollArea: {
        maxHeight: 300,
        marginBottom: theme.spacing.md,
    },

    exerciseItem: {
        backgroundColor: theme.colors.surfaceSoft,
        borderRadius: 12,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    exerciseText: {
        fontWeight: '600',
        fontSize: 16,
        color: theme.colors.textPrimary,
    },
    exerciseHint: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 2,
    },

    modalBtns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalBtn: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        marginHorizontal: 4,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalBtnText: {
        fontWeight: '700',
        color: '#fff',
    },
});