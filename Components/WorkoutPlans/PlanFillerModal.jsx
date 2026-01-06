import React, { useState, useEffect } from 'react';
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
        if (!exercisesDB || exercisesDB.length === 0) {
            Alert.alert('Brak ćwiczeń', 'Nie udało się pobrać ćwiczeń z bazy.');
            return;
        }

        const coveredMuscles = new Set();
        currentExercises.forEach(ex => ex.muscle_group?.forEach(mg => coveredMuscles.add(mg.name)));

        const newSuggestions = [];

        const availableExercises = exercisesDB.filter(
            ex => !currentExercises.some(e => e.id === ex.id)
        );

        for (let muscle of priorityMuscles) {
            if (newSuggestions.length + currentExercises.length >= maxExercises) break;

            const candidate = availableExercises.find(ex => ex.muscle_group.some(mg => mg.name === muscle) && !newSuggestions.some(e => e.id === ex.id));

            if (candidate) {
                newSuggestions.push(candidate);
            }
        }

        if (newSuggestions.length === 0) {
            Alert.alert('Plan jest pełny', 'Nie ma brakujących ćwiczeń do dodania.');
            return;
        }

        setSuggestedExercises(newSuggestions);
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