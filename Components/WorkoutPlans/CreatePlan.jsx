import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import data from '../../baza.json';
import AddExercise from './AddExercise';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePlan = () => {
  const navigation = useNavigation();

  const [planName, setPlanName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const addExerciseToPlan = (exercise) => {
    setSelectedExercises(prev => [ ...prev, {...exercise, reps: 0, sets: 0, weight: 0} ])
  };

  const updateExerciseInPlan = (id, fields) => {
    setSelectedExercises(prev => prev.map(exercise => (exercise.id === id ? { ...exercise, ...fields } : exercise)));
  }

  useEffect(() => {
    AsyncStorage.getItem('workouts').then((data) => {
      if (data) {
        setWorkouts(JSON.parse(data));
      }
    });
  }, []);

  const getLastId = () => {
    return workouts.length === 0 ? 1 : workouts[workouts.length - 1].id + 1;
  };

  const savePlan = () => {
    const newWorkout = {
      id: getLastId(),
      name: planName,
      exercises: selectedExercises.map((exercise) => ({
        name: exercise.name,
        id: exercise.id,
        reps: exercise.reps,
        sets: exercise.sets,
        weight: exercise.weight,
      })),
    };

    AsyncStorage.setItem('workouts', JSON.stringify([...workouts, newWorkout]));
    
    navigation.goBack();
  };

  return (
    <View>
      <TouchableOpacity onPress={() => savePlan()}>
        <Text>Save Plan</Text>
      </TouchableOpacity>

      <Text>Create New Plan</Text>
      <TextInput placeholder="Plan Name" value={planName} onChangeText={setPlanName} />

      {/* ============================================= */}
      
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
        {data.exercises.map((exercise) => (
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
