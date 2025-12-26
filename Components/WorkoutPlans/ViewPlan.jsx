import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Touchable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseCard from './ExerciseCard';
import baza from '../../baza.json';

const ViewPlan = ({ route }) => {
  const navigation = useNavigation();
  const { plan: initialPlan } = route.params;

  const [plan, setPlan] = useState(initialPlan);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <View>
      <Text>{plan.name}</Text>

      <TouchableOpacity onPress={handleEdit}>
        <Text>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete}>
        <Text>Delete</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={viewMuscleMap}>
        <Text>Check Total Plan Load</Text>
      </TouchableOpacity>

      <Text>Exercises:</Text>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={prev} disabled={currentIndex === 0}>
            <Text>
              Previous
            </Text>
          </TouchableOpacity>

          <Text>
            {currentIndex + 1} / {plan.exercises.length}
          </Text>

          <TouchableOpacity onPress={next} disabled={currentIndex === plan.exercises.length - 1}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
        <ExerciseCard exercise={plan.exercises[currentIndex]} />
      </View>
    </View>
  );
};

export default ViewPlan;