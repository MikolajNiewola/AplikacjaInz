import React, { useState, useCallback } from 'react';
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
      <Text>Twoje zapisane plany:</Text>
      {plans && plans.map((plan) => (
        <View key={plan.id}>
          <TouchableOpacity onPress={() => navigation.navigate('View Plan', { plan })}>
            <Text>{plan.name}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {plans.length === 0 && <Text>Brak zapisanych planów treningowych.</Text>}

      <TouchableOpacity onPress={() => navigation.navigate('Create Plan')}>
        <Text>+ Nowy Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutPlans;