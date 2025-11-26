import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);

  const navigation = useNavigation();

  loadPlans = () => {
    AsyncStorage.getItem('workouts').then((data) => {
      if (data) {
        setPlans(JSON.parse(data));
      };
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, [])
  );

  return (
    <View>
      <Text>Workout Plans Screen</Text>

      {plans.map((plan) => (
        <View key={plan.id}>
          <TouchableOpacity onPress={() => navigation.navigate('ViewPlan', { plan })}>
            <Text>{plan.name}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={() => navigation.navigate('CreatePlan')}>
        <Text>+ New Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutPlans;