import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user_profile';

export const useUserProfileStore = create((set, get) => ({
    bodyweight: null,
    goal: null,
    isInitialized: false,

    loadProfile: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if(!stored) return;

            const parsed = JSON.parse(stored);
            set({
                bodyweight: parsed.bodyweight ?? null,
                goal: parsed.goal ?? null,
                isInitialized: true,
            });
        } catch (e) {
            console.error('Error loading user profile: ', e);
        }
    },

    saveProfile: async ({ bodyweight, goal }) => {
        const profile = { bodyweight, goal };

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            set({
                bodyweight,
                goal,
                isInitialized: true,
            });
        } catch (e) {
            console.error('Error saving user profile: ', e);
        }
    },

    resetProfile: async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        set({
            bodyweight: null,
            goal: null,
            isInitialized: false,
        });
    },
}));