import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExerciseStore } from '../ZustandStores/ExerciseStore';
import { updateRecordsFromWorkouts } from '../utils/updateRecordsFromWorkouts';
import { theme } from '../Themes';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrophy, faDumbbell, faRepeat, faWeightHanging } from '@fortawesome/free-solid-svg-icons';

const RECORDS_KEY = 'exercise_records';

const Records = () => {
    const { exercisesDB } = useExerciseStore();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const loadRecords = async () => {
            const storedRecords = await AsyncStorage.getItem(RECORDS_KEY);
            const existing = storedRecords ? JSON.parse(storedRecords) : {};

            const storedWorkouts = await AsyncStorage.getItem('workouts');
            const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

            const updated = updateRecordsFromWorkouts(
                existing,
                workouts,
                exercisesDB
            );

            await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
            setRecords(Object.values(updated));
        };

        if (exercisesDB.length) {
            loadRecords();
        }
    }, [exercisesDB]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {records.length === 0 ? (
                <View style={styles.emptyState}>
                    <FontAwesomeIcon
                        icon={faTrophy}
                        size={48}
                        color={theme.colors.textMuted}
                        style={{ marginBottom: 16 }}
                    />

                    <Text style={styles.emptyTitle}>Brak rekordów</Text>

                    <Text style={styles.emptyText}>
                        Nie ustanowiłeś jeszcze żadnych rekordów treningowych.
                        {'\n\n'}
                        Rekordy zapisują się automatycznie podczas treningów,
                        więc po prostu ćwicz i wracaj tutaj, aby śledzić swoje postępy.
                    </Text>
                </View>
            ) : (
                records.map(r => (
                    <View key={r.id} style={styles.card}>
                        <Text style={styles.name}>{r.name}</Text>

                        <View style={styles.row}>
                            <FontAwesomeIcon
                                icon={faRepeat}
                                size={14}
                                color={theme.colors.textMuted}
                            />
                            <Text style={styles.stat}>
                                Max powtórzeń:{' '}
                                <Text style={styles.value}>{r.maxReps}</Text>
                            </Text>
                        </View>

                        {r.maxWeight > 0 && (
                            <View style={styles.row}>
                                <FontAwesomeIcon
                                    icon={faWeightHanging}
                                    size={14}
                                    color={theme.colors.textMuted}
                                />
                                <Text style={styles.stat}>
                                    Max ciężar:{' '}
                                    <Text style={styles.value}>
                                        {r.maxWeight} kg
                                    </Text>
                                </Text>
                            </View>
                        )}

                        {!r.isBodyweight && r.best1RM > 0 && (
                            <View style={styles.row}>
                                <FontAwesomeIcon
                                    icon={faDumbbell}
                                    size={14}
                                    color={theme.colors.textMuted}
                                />
                                <Text style={styles.stat}>
                                    Szacowane 1RM:{' '}
                                    <Text style={styles.value}>
                                        {Math.round(r.best1RM)} kg
                                    </Text>

                                    {r.best1RMSet && (
                                        <Text style={styles.subValue}>
                                            {' '}({r.best1RMSet.reps}×{r.best1RMSet.weight} kg)
                                        </Text>
                                    )}
                                </Text>
                            </View>
                        )}

                        {r.isBodyweight && (
                            <Text style={styles.note}>
                                Ćwiczenie z masą ciała
                                {r.maxWeight > 0
                                    ? ' (z obciążeniem dodatkowym)'
                                    : ''}
                            </Text>
                        )}
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },

    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    name: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },

    stat: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },

    value: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
    },

    note: {
        marginTop: 6,
        fontSize: 12,
        color: theme.colors.textMuted,
        fontStyle: 'italic',
    },

    emptyState: {
        marginTop: 80,
        paddingHorizontal: 24,
        alignItems: 'center',
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },

    emptyText: {
        textAlign: 'center',
        color: theme.colors.textMuted,
        fontSize: 14,
        lineHeight: 20,
    },

    subValue: {
        color: theme.colors.textMuted,
        fontSize: 13,
    },

});

export default Records;
