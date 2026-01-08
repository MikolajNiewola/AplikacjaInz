import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../Themes/index';
import ContextMenu from '../Components/WorkoutPlans/ContextMenu';

const ExerciseCountFormat = (count) => {
    if (count === 1) return 'ćwiczenie';

    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
        return 'ćwiczenia';
    }

    return 'ćwiczeń';
};

const WorkoutPlans = () => {
    const [plans, setPlans] = useState([]);
    const [contextPlan, setContextPlan] = useState(null);

    const navigation = useNavigation();

    const handleDelete = (planToDelete) => {
        Alert.alert("Usuwanie planu", "Czy na pewno chcesz usunąć ten plan?", [
            { text: "Anuluj" },
            { 
                text: "USUŃ", 
                onPress: async () => {
                    try {
                    const stored = await AsyncStorage.getItem('workouts');
                    const parsed = stored ? JSON.parse(stored) : [];
                    const filtered = parsed.filter(p => p.id !== planToDelete.id);
                    await AsyncStorage.setItem('workouts', JSON.stringify(filtered));
                    setPlans(filtered);
                    setContextPlan(null);
                    } catch (e) {
                    console.error('Error deleting a workout: ', e);
                    }
                }
            }
        ]);
    };

    loadPlans = () => {
        AsyncStorage.getItem('workouts').then((data) => {
            setPlans(data ? JSON.parse(data) : []);
        });
    };

    useFocusEffect(
        useCallback(() => {
            loadPlans();
        }, [])
    );

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Twoje zapisane plany:</Text>

            <ScrollView style={styles.list}>
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <TouchableOpacity
                        key={plan.id}
                        style={styles.planCard}
                        onPress={() => navigation.navigate('View Plan', { plan })}
                        onLongPress={() => setContextPlan(plan)}
                        >
                        <Text style={styles.planName}>{plan.name}</Text>
                        <Text style={styles.planInfo}>{plan.exercises.length} {ExerciseCountFormat(plan.exercises.length)}</Text>
                        </TouchableOpacity>
                    ))
                    ) : (
                    <Text style={styles.noPlans}>Brak zapisanych planów treningowych.</Text>
                )}
            </ScrollView>

            {contextPlan && (
                <View style={styles.overlay}>
                <ContextMenu
                    plan={contextPlan}
                    onDelete={handleDelete}
                    onEdit={(plan) => navigation.navigate('Create Plan', { plan })}
                    onClose={() => setContextPlan(null)}
                />
                </View>
            )}

            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate('Create Plan')}
            >
                <Text style={styles.addBtnText}>+ Nowy Plan</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },

    title: {
        color: theme.colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },

    list: {
        flex: 1,
        marginBottom: theme.spacing.md,
    },

    planCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    planName: {
        color: theme.colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
    },

    planInfo: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
    },

    noPlans: {
        color: theme.colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },

    addBtn: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    addBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },

    contextMenu: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    contextTitle: {
        color: theme.colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },

    contextDelete: {
        backgroundColor: theme.colors.danger,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },

    contextDeleteText: {
        color: '#fff',
        fontWeight: '800',
    },

    contextCancel: {
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginTop: theme.spacing.sm,
    },
});


export default WorkoutPlans;