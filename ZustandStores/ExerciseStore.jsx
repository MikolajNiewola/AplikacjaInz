import { create } from 'zustand';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { cacheExerciseMedia } from '../utils/mediaCache';

const STORAGE_KEY = 'exercises';

const api = axios.create({
    baseURL: 'http://10.0.2.2:3000/api',
    headers: {'Content-Type': 'application/json'}
});

export const useExerciseStore = create((set) => ({
    exercisesDB: [],
    pickedExercisesTemp: [],
    
    fetchExercises: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                set({ exercisesDB: JSON.parse(stored) });
            } else {
                const response = await api.get('/exercises');
                const cached = await cacheExerciseMedia(response.data)

                set({ exercisesDB: cached });
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
            }
        } catch (error) {
            console.error("Error fetching exercises", error);
        }
    },

    setPickedExercisesTemp: (exercises) => set({ pickedExercisesTemp: exercises }),
}));