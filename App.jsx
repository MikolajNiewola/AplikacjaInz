import React from 'react';
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

const Stack = createNativeStackNavigator();

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
      
    </Stack.Navigator>
  );
};

function App() {
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
