import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExerciseStore } from '../../ZustandStores/ExerciseStore';
import AddExercise from './AddExercise';

function getLastId( array ) {
  return array.length === 0 ? 1 : array[array.length - 1].id + 1;
};

const CreatePlan = ({ route }) => {
  const { exercisesDB, fetchExercises } = useExerciseStore();
  const navigation = useNavigation();
  const { plan } = route.params || {};

  const [planName, setPlanName] = useState(plan?.name || '');
  const [selectedExercises, setSelectedExercises] = useState(plan?.exercises || []);

  useEffect(() => {
    fetchExercises();
  }, []);

  const availableExercises = useMemo(() => {
    if (!exercisesDB.length) return [];
    const selectedIds = new Set(selectedExercises.map(ex => ex.id));
    return exercisesDB.filter(ex => !selectedIds.has(ex.id));
  }, [exercisesDB, selectedExercises]);

  const addExerciseToPlan = (exercise) => {
    setSelectedExercises(prev => [ ...prev, {...exercise, reps: 0, sets: 0} ])
  };

  const removeExerciseFromPlan = (id) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
  }

  const updateExerciseInPlan = (id, fields) => {
    setSelectedExercises(prev => prev.map(ex => (ex.id === id ? { ...ex, ...fields } : ex)));
  }

  const savePlan = async () => {
    const stored = await AsyncStorage.getItem('workouts');
    const parsed = stored ? JSON.parse(stored) : [];

    const newWorkout = {
      id: plan?.id || getLastId(parsed),
      name: planName,
      exercises: selectedExercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        reps: exercise.reps,
        sets: exercise.sets,
        weight: exercise.weight,
      })),
    };

    const updatedWorkouts = plan ? parsed.map(w => w.id === plan.id ? newWorkout : w) : [...parsed, newWorkout];

    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    
    navigation.goBack();
  };

  return (
    <View style={{ padding: 10 }}>
      <TouchableOpacity onPress={savePlan}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Zapisz Plan</Text>
      </TouchableOpacity>

      <Text>{plan ? 'Edytuj Plan' : 'Stwórz Nowy Plan'}</Text>
      <TextInput
        placeholder="Nazwa Planu"
        value={planName}
        onChangeText={setPlanName}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, marginVertical: 10 }}
      />

      {/* ============================================= */}

      <TouchableOpacity onPress={() => {navigation.navigate('Muscle Map', { exercises: selectedExercises });}}>
        <Text>Sprawdź mapę mięśni</Text>
      </TouchableOpacity>
      
      <Text>Dodane ćwiczenia:</Text>
      <ScrollView style={{ maxHeight: 200, marginBottom: 20 }}>
        {selectedExercises.length > 0 ? (
          selectedExercises.map((exercise) => (
            <AddExercise
              key={exercise.id}
              exercise={exercise}
              onChange={(fields) => updateExerciseInPlan(exercise.id, fields)}
              onRemove={() => removeExerciseFromPlan(exercise.id)}
            />
          ))
        ) : (
          <Text>Brak dodanych ćwiczeń</Text>
        )}
      </ScrollView>
      
      {/* ============================================= */}

      <Text>Dostępne ćwiczenia:</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {availableExercises.map((exercise) => (
          <View key={exercise.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text>{exercise.name}</Text>
            <TouchableOpacity onPress={() => addExerciseToPlan(exercise)}>
              <Text style={{ color: 'blue' }}>Dodaj do planu</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

    </View>
  );
};

export default CreatePlan;
