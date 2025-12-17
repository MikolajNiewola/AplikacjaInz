import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import baza from '../../baza.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewPlan = ({ route }) => {
  const navigation = useNavigation();
  const { plan: initialPlan } = route.params;

  const [plan, setPlan] = useState(initialPlan);

  useFocusEffect(
    useCallback(() => {
      const loadPlan = async () => {
        try {
          const stored = await AsyncStorage.getItem('workouts');
          const parsed = JSON.parse(stored);

          const updatedPlan = parsed.find(p => p.id === initialPlan.id);
          if (updatedPlan) setPlan(updatedPlan);
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
    Alert.alert("Delete Workout", "Are you sure you want to delete this plan?", [
      {
        text: "cancel",
      },
      {
        text: "DELETE",
        onPress: async () => {
          try {
            const plans = await AsyncStorage.getItem('workouts');
            console.log("bez parse: ", plans);
            
            const parsedPlans = JSON.parse(plans);
            console.log("po parse: ",parsedPlans);

            const filtered = parsedPlans.filter(p => p.id !== plan.id);

            await AsyncStorage.setItem('workouts', JSON.stringify(filtered));
            navigation.goBack();
          } catch (e) {
            console.error('Error deleting a workout: ', e);
          }
        }
      }
    ])
  };

  return (
    <View>
      <Text>{plan.name}</Text>

      <TouchableOpacity onPress={handleEdit}>
        <Text>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete}>
        <Text>Delete</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={viewMuscleMap}>
        <Text>View Muscle Map</Text>
      </TouchableOpacity>

      <Text>Exercises:</Text>
      <ScrollView>
        {plan.exercises.map((exercise) => (
          <View key={exercise.id}>
            <Text>
              {baza.exercises[exercise.id].name}
            </Text>
            <Text>Reps: {exercise.reps}</Text>
            <Text>Sets: {exercise.sets}</Text>
            <Text>Weight: {exercise.weight}</Text>
          </View>
            
        ))}
      </ScrollView>
    </View>
  );
};

export default ViewPlan;