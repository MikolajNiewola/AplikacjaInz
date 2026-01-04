import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from './Screens/Home';
import Settings from './Screens/Settings';
import Exercises from './Screens/Exercises';
import MuscleMap from './Screens/MuscleMap';
import WorkoutPlans from './Screens/WorkoutPlans';

import CreatePlan from './Components/WorkoutPlans/CreatePlan';
import ViewPlan from './Components/WorkoutPlans/ViewPlan';
import SelectExercises from './Components/WorkoutPlans/SelectExercises';
import TempoTimer from './Components/WorkoutPlans/TempoTimer';

const Stack = createNativeStackNavigator();

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const fetchAndSaveExercises = async () => {
  try {
    const response = await api.get('/exercises');
    const exercises = response.data;

    await AsyncStorage.setItem('exercises', JSON.stringify(exercises));
    console.log("Exercises data updated successfully.");
  } catch (error) {
    console.error("Error fetching exercises data", error);
  }
};

const Rootstack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Exercises" component={Exercises} />
      <Stack.Screen name="Muscle Map" component={MuscleMap} />
      <Stack.Screen name="Workout Plans" component={WorkoutPlans} />

      <Stack.Screen name="Create Plan" component={CreatePlan} />
      <Stack.Screen name="View Plan" component={ViewPlan} />
      <Stack.Screen name="Select Exercises" component={SelectExercises} />
      <Stack.Screen name="Tempo Timer" component={TempoTimer} />
    </Stack.Navigator>
  );
};

function App() {
  useEffect(() => {
    fetchAndSaveExercises();
  }, []);

  return (
    <NavigationContainer>
      <Rootstack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
