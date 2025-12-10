import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import baza from '../../baza.json';

const ViewPlan = ({ route }) => {
  const navigation = useNavigation();
  const { plan } = route.params;

  const goToMuscleMap = () => {
    navigation.navigate('Muscle Map', { exercises: plan.exercises });
  };

  return (
    <View>
      <Text>Plan: {plan.name}</Text>

      <TouchableOpacity onPress={goToMuscleMap}>
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