import { create } from 'zustand';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { cacheExerciseImages } from '../utils/imageCache';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useExerciseStore = create((set) => ({
    exercisesDB: [],
    pickedExercisesTemp: [],
    
    fetchExercises: async () => {
        try {
            const stored = await AsyncStorage.getItem('exercises');
            if (stored) {
                set({ exercisesDB: JSON.parse(stored) });
            } else {
                const response = await api.get('/exercises');
                const exercisesWithLocalImages = await cacheExerciseImages(response.data)

                set({ exercisesDB: exercisesWithLocalImages });
                await AsyncStorage.setItem('exercises', JSON.stringify(exercisesWithLocalImages));
            }
        } catch (error) {
            console.error("Error fetching exercises", error);
        }
    },

    setPickedExercisesTemp: (exercises) => set({ pickedExercisesTemp: exercises }),
}));