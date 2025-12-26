import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import data from '../../baza.json';
import AddExercise from './AddExercise';

const CreatePlan = ({ route }) => {
  const navigation = useNavigation();
  const { plan } = route.params || {};

  const [planName, setPlanName] = useState(plan?.name || '');
  const [selectedExercises, setSelectedExercises] = useState(plan?.exercises || []);
  const [availableExercises, setAvailableExercises] = useState(
    plan?.exercises
      ? data.exercises.filter(ex => !plan.exercises.some(selected => selected.id === ex.id))
      : data.exercises
  );

  const addExerciseToPlan = (exercise) => {
    setSelectedExercises(prev => [ ...prev, {...exercise, reps: 0, sets: 0} ])
    setAvailableExercises(prev => prev.filter(ex => ex.id !== exercise.id));
  };

  const updateExerciseInPlan = (id, fields) => {
    setSelectedExercises(prev => prev.map(ex => (ex.id === id ? { ...ex, ...fields } : ex)));
  }

  const getLastId = ( array ) => {
    return array.length === 0 ? 1 : array[array.length - 1].id + 1;
  };

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

    let updatedWorkouts;

    if (plan) {
      updatedWorkouts = parsed.map(w => w.id === plan.id ? newWorkout : w);
    } else {
      updatedWorkouts = [...parsed, newWorkout];
    }

    AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    
    navigation.goBack();
  };

  return (
    <View>
      <TouchableOpacity onPress={() => savePlan()}>
        <Text>Save Plan</Text>
      </TouchableOpacity>

      <Text>{plan ? 'Edit Plan' : 'Create New Plan'}</Text>
      <TextInput placeholder="Plan Name" value={planName} onChangeText={setPlanName} />

      {/* ============================================= */}

      <TouchableOpacity onPress={() => {navigation.navigate('Muscle Map', { exercises: selectedExercises });}}>
        <Text>Check Muscle Load</Text>
      </TouchableOpacity>
      
      <Text>Selected Exercises:</Text>
      <ScrollView style={{ height: 200 }}>
        
        {selectedExercises.length > 0 
        ? selectedExercises.map((exercise) => (
          <AddExercise 
            key={exercise.id} 
            exercise={exercise} 
            onChange={(fields) => updateExerciseInPlan(exercise.id, fields)} 
          />
        )) 
        : <Text>No exercises selected</Text>}
      </ScrollView>
      
      {/* ============================================= */}

      <Text>Available Exercises:</Text>
      <ScrollView style={{ height: 200 }}>
        {availableExercises.map((exercise) => (
          <View key={exercise.id}>
            <Text>{exercise.name}</Text>
            <TouchableOpacity onPress={() => addExerciseToPlan(exercise)}>
              <Text>Add to plan</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

    </View>
  );
};

export default CreatePlan;
