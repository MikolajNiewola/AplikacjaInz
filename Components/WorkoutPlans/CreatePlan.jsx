import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExerciseStore } from '../../ZustandStores/ExerciseStore';
import AddExercise from './AddExercise';
import { theme } from '../../Themes/index';

function getLastId(array) {
  return array.length === 0 ? 1 : array[array.length - 1].id + 1;
}

const CreatePlan = () => {
  const { fetchExercises, pickedExercisesTemp, setPickedExercisesTemp } = useExerciseStore();
  const navigation = useNavigation();
  const route = useRoute();
  const { plan } = route.params || {};

  const [planName, setPlanName] = useState(plan?.name || '');
  const [selectedExercises, setSelectedExercises] = useState(plan?.exercises || []);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (pickedExercisesTemp?.length) {
      setSelectedExercises(prev => {
        const existingIds = new Set(prev.map(ex => ex.id));
        const withDefaults = pickedExercisesTemp
          .filter(ex => !existingIds.has(ex.id))
          .map(ex => ({ ...ex, reps: 0, sets: 0, weight: 0 }));
        return [...prev, ...withDefaults];
      });
      setPickedExercisesTemp([]);
    }
  }, [pickedExercisesTemp]);

  const removeExerciseFromPlan = (id) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const updateExerciseInPlan = (id, fields) => {
    setSelectedExercises(prev => prev.map(ex => (ex.id === id ? { ...ex, ...fields } : ex)));
  };

  const savePlan = async () => {
    if (!planName.trim()) {
      Alert.alert('Uwaga!', 'Proszę podać nazwę planu.', [{ text: 'OK' }]);
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Uwaga!', 'Proszę dodać przynajmniej jedno ćwiczenie do planu.', [{ text: 'OK' }]);
      return;
    }

    const stored = await AsyncStorage.getItem('workouts');
    const parsed = stored ? JSON.parse(stored) : [];

    const newWorkout = {
      id: plan?.id || getLastId(parsed),
      name: planName,
      exercises: selectedExercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        reps: ex.reps,
        sets: ex.sets,
        weight: ex.weight,
        tempo: ex.tempo || null,
      })),
    };

    const updatedWorkouts = plan
      ? parsed.map(w => w.id === plan.id ? newWorkout : w)
      : [...parsed, newWorkout];

    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag'>
        <View style={styles.containerHeader}>
          <TouchableOpacity style={styles.saveBtn} onPress={savePlan}>
            <Text style={styles.saveText}>Zapisz plan</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {plan ? 'Edytuj plan' : 'Stwórz nowy plan'}
          </Text>
        </View>


        <TextInput
          placeholder="Nazwa planu"
          placeholderTextColor={theme.colors.textMuted}
          value={planName}
          onChangeText={setPlanName}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate('Muscle Map', { exercises: selectedExercises })}
        >
          <Text style={styles.linkText}>Sprawdź mapę mięśni</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Wybrane ćwiczenia</Text>

        <View style={styles.list}>
          {selectedExercises.length > 0 ? (
            selectedExercises.map(exercise => (
              <AddExercise
                key={exercise.id}
                exercise={exercise}
                onChange={fields =>
                  updateExerciseInPlan(exercise.id, fields)
                }
                onRemove={() => removeExerciseFromPlan(exercise.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Brak dodanych ćwiczeń</Text>
          )}
        </View >
        
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate('Select Exercises', {
              selectedIds: selectedExercises.map(ex => ex.id),
            })
          }
        >
          <Text style={styles.addText}>+ Dodaj ćwiczenia</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },

  containerHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  input: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 10,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    marginBottom: theme.spacing.md,
  },

  saveBtn: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 10,
    marginBottom: theme.spacing.sm,
  },

  saveText: {
    color: '#000',
    fontWeight: '700',
  },

  linkBtn: {
    marginBottom: theme.spacing.md,
  },

  linkText: {
    color: theme.colors.accentSoft,
    fontWeight: '600',
  },

  list: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: theme.spacing.sm,
    minHeight: 70,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },

  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },

  addBtn: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 10,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },

  addText: {
    color: theme.colors.accent,
    fontWeight: '700',
  },
});


export default CreatePlan;
