import React, { useState, useEffect } from 'react';
import BootSplash from "react-native-bootsplash";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faHeartbeat, faCalendar, faCog } from '@fortawesome/free-solid-svg-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useUserProfileStore } from './ZustandStores/UserProfileStore';
import { theme } from './Themes/index';

import Home from './Screens/Home';
import Settings from './Screens/Settings';
import Exercises from './Screens/Exercises';
import MuscleMap from './Screens/MuscleMap';
import WorkoutPlans from './Screens/WorkoutPlans';
import Records from './Screens/Records';

import CreatePlan from './Components/WorkoutPlans/CreatePlan';
import ViewPlan from './Components/WorkoutPlans/ViewPlan';
import SelectExercises from './Components/WorkoutPlans/SelectExercises';
import TempoTimer from './Components/WorkoutPlans/TempoTimer';
import UserProfileModal from './Components/User/UserProfileModal';
import { useExerciseStore } from './ZustandStores/ExerciseStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
            <Stack.Screen name="Records" component={Records} options={{title: 'Rekordy'}} />
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
    const [appReady, setAppReady] = useState(false);

    const { fetchExercises } = useExerciseStore();
    const { isInitialized, loadProfile } = useUserProfileStore();

    useEffect(() => {
        const init = async () => {
            try {
                fetchExercises();
                await loadProfile();
            } catch (e) {
                console.error('Init error: ', e);
            } finally {
                setAppReady(true);
                await BootSplash.hide({fade: true});
            }
        };

        init()
    }, []);

    return (
        <NavigationContainer>
            <Rootstack />
            {appReady && (
                <UserProfileModal visible={!isInitialized} force />
            )}
        </NavigationContainer>
    );
}

export default App;
