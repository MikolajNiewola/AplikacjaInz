import { create } from 'zustand';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useExerciseStore = create((set) => ({
    exercisesDB: [],
    
    fetchExercises: async () => {
        try {
            const stored = await AsyncStorage.getItem('exercises');
            if (stored) {
                set({ exercisesDB: JSON.parse(stored) });
            } else {
                const response = await api.get('/exercises');
                set({ exercisesDB: response.data });
                await AsyncStorage.setItem('exercises', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error fetching exercises", error);
        }
    }
}));