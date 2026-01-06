import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StyleSheet, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faHeartbeat, faCalendar, faCog } from '@fortawesome/free-solid-svg-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './Themes/index';

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
const Tab = createBottomTabNavigator();

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
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.textPrimary,
                headerTitleStyle: {
                    fontWeight: '800',
                },
            }}
        >
            <Stack.Screen
                name="Main"
                component={TabsNavigator}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="Muscle Map" component={MuscleMap}  options={{ title: 'Mapa mięśni' }}/>
            <Stack.Screen name="Create Plan" component={CreatePlan} options={{ title: 'Tworzenie planu' }}/>
            <Stack.Screen name="View Plan" component={ViewPlan} options={{ title: 'Twój plan treningowy' }} />
            <Stack.Screen name="Select Exercises" component={SelectExercises}  options={{ title: 'Wybierz ćwiczenia' }}/>
            <Stack.Screen name="Tempo Timer" component={TempoTimer} options={{ title: 'Licznik tempa' }} />
        </Stack.Navigator>
    );
};

const getIcon = (routeName) => {
    switch(routeName) {
        case 'Home':
            return faHome;
        case 'Exercises':
            return faHeartbeat;
        case 'Workout Plans':
            return faCalendar;
        case 'Settings':
            return faCog;
        default:
            return faHome;
    }
};

const TabsNavigator = () => {
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <FontAwesomeIcon
                        icon={getIcon(route.name)}
                        size={size ?? 22}
                        color={color}
                    />
                ),
                tabBarActiveTintColor: theme.colors.accent,
                tabBarInactiveTintColor: theme.colors.textMuted,

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: 4,
                },

                tabBarStyle: {
                    height: 64,
                    paddingTop: 6,
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.borderSoft,
                },

            })}
        >
            <Tab.Screen name='Home' component={Home} options={{title: 'Główna'}}/>
            <Tab.Screen name='Exercises' component={Exercises} options={{title: 'Ćwiczenia'}}/>
            <Tab.Screen name='Workout Plans' component={WorkoutPlans} options={{title: 'Plany'}}/>
            <Tab.Screen name='Settings' component={Settings} options={{title: 'Ustawienia'}}/>
        </Tab.Navigator>
    )
}

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
