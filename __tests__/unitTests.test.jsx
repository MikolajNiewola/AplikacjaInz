import { sanitizeNumber } from '../utils/numberInput'

describe('sanitizeNumber', () => {
    test('zamiana przecinka na kropkę', () => {
        const testValue = '12,34';
        const finalValue = '12.34';

        const result = sanitizeNumber(testValue);

        expect(result).toBe(finalValue);
    });

    test('usuwanie niedozwolonych znaków', () => {
        const testValue = 'a1b2c.3d4';
        const finalValue = '12.34';

        const result = sanitizeNumber(testValue);

        expect(result).toBe(finalValue);
    });

    test('obcinanie do dwoch znakow po przecinku', () => {
        const testValue = '12.342323';
        const finalValue = '12.34';

        const result = sanitizeNumber(testValue);

        expect(result).toBe(finalValue);
    });

    test('tylko jedna kropka', () => {
        const testValue = '1.2.3.4.';
        const finalValue = '1.23';

        const result = sanitizeNumber(testValue);

        expect(result).toBe(finalValue);
    });

    test('usuwanie zera wiodącego', () => {
        const testValue = '012.34';
        const finalValue = '12.34';

        const result = sanitizeNumber(testValue);

        expect(result).toBe(finalValue);
    });
})

import { calculateMuscleVolume } from '../utils/calculateMuscleVolume';
import { useUserProfileStore } from '../ZustandStores/UserProfileStore';

jest.mock('../ZustandStores/UserProfileStore', () => ({
    useUserProfileStore: jest.fn()
}));

describe('calculateMuscleVolume', () => {
    beforeEach(() => {
        useUserProfileStore.mockReturnValue({
            bodyweight: 80
        });
    });

    test('poprawne obliczenie objętości mięśni', () => {
        const planExercises = [
            {id: 1, sets: 3, reps: 10, weight: 20 }
        ];

        const exercisesDB = [
            {
                id: 1,
                bodyweightFactor: 0.5,
                muscles: [
                    { name: 'chest', ratio: 0.7 },
                    { name: 'triceps', ratio: 0.3 }
                ]
            }
        ];

        const result = calculateMuscleVolume(planExercises, exercisesDB);

        expect(result).toEqual({
            chest: 1800 * 0.7,
            triceps: 1800 * 0.3
        });
    });
});