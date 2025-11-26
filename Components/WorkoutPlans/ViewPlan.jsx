import React from 'react';
import { View, Text } from 'react-native';

const ViewPlan = ({ route }) => {
  const { plan } = route.params;

  return (
    <View>
        <Text>Nazwa planu: {plan.name}</Text>
        <Text>Exercises:</Text>
        {plan.exercises.map((exercise) => (
          <View key={exercise.id}>
            <Text>{exercise.name}</Text>
            <Text>Reps: {exercise.reps}</Text>
            <Text>Sets: {exercise.sets}</Text>
            <Text>Weight: {exercise.weight}</Text>
          </View>
        ))}
    </View>
  );
};

export default ViewPlan;