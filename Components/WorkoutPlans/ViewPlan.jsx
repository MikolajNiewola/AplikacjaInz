import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Touchable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseCard from './ExerciseCard';

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
    <View>
      <Text>{plan.name}</Text>

      <TouchableOpacity onPress={handleEdit}>
        <Text>Edytuj</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete}>
        <Text>Usuń</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={viewMuscleMap}>
        <Text>Sprawdź mapę mięśni</Text>
      </TouchableOpacity>

      <Text>Ćwiczenia:</Text>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={prev} disabled={currentIndex === 0}>
            <Text>
              Poprzednie
            </Text>
          </TouchableOpacity>

          <Text>
            {currentIndex + 1} / {plan.exercises.length}
          </Text>

          <TouchableOpacity onPress={next} disabled={currentIndex === plan.exercises.length - 1}>
            <Text>Następne</Text>
          </TouchableOpacity>
        </View>
        <ExerciseCard exercise={plan.exercises[currentIndex]} />
      </View>
    </View>
  );
};

export default ViewPlan;