import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import baza from '../../baza.json';

const aggregateMuscleLoads = (exercises) => {
  const aggregated = {};
  exercises.forEach((exercise) => {
    baza.exercises[exercise.id].muscle_group.forEach(({ name, load }) => {
      aggregated[name] = (aggregated[name] || 0) + (load || 0);
    });
  });
  return aggregated;
};

const ViewPlan = ({ route }) => {
  const navigation = useNavigation();
  const { plan } = route.params;

  const aggregatedLoads = aggregateMuscleLoads(plan.exercises);

  return (
    <View>
      <Text>Plan: {plan.name}</Text>
      
      <TouchableOpacity onPress={() => {navigation.navigate('Muscle Map', { muscleLoads: aggregatedLoads })}}>
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
      {/* <Text>Muscle Loads: {JSON.stringify(aggregatedLoads)}</Text> */}
    </View>
  );
};

export default ViewPlan;