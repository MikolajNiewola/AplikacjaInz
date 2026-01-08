import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useExerciseStore } from '../../ZustandStores/ExerciseStore';
import { theme } from '../../Themes/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';

const ExerciseCard = ({ exercise }) => {
    const { exercisesDB } = useExerciseStore();
    const navigation = useNavigation();
    
    const [expanded, setExpanded] = useState(false);
    const exerciseData = exercisesDB.find(e => e.id === exercise.id);

    const Stat = ({ label, value }) => (
        <View style={styles.stat}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const goToTempoTimer = () => {
        if (!exercise.tempo) return;
        navigation.navigate("Tempo Timer", { exercise });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.name}>{exercise.name}</Text>
            </View>

            <View style={styles.statsRow}>
                <Stat label="Serie" value={exercise.sets} />
                <Stat label="Powt." value={exercise.reps} />
                <Stat label="Kg" value={exercise.weight} />
            </View>

            {exercise.tempo && (
                <View style={styles.tempoBox}>
                    <Text style={styles.tempoTitle}>Tempo</Text>

                    <Text style={styles.tempoValueBig}>
                        {exercise.tempo}
                    </Text>

                    <TouchableOpacity
                        style={styles.tempoStartBtn}
                        onPress={goToTempoTimer}
                        activeOpacity={0.8}
                    >
                        <View style={styles.tempoStartContent}>
                        <FontAwesomeIcon
                            icon={faPlay}
                            size={14}
                            color="#000"
                            style={styles.tempoStartIcon}
                        />
                        <Text style={styles.tempoStartText}>Licznik tempa</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {exerciseData?.instructions?.length > 0 && (
                <TouchableOpacity
                    style={styles.toggleBtn}
                    onPress={() => setExpanded(prev => !prev)}
                >
                    <Text style={styles.toggleText}>
                        {expanded ? 'Ukryj instrukcje' : 'Pokaż instrukcje'}
                    </Text>
                </TouchableOpacity>
            )}

            {expanded && exerciseData?.instructions && (
                <View style={styles.instructions}>
                    {exerciseData.instructions.map((inst, index) => (
                        <View key={index} style={styles.instructionRow}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.instructionText}>{inst}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.md,
    },

    header: {
        marginBottom: theme.spacing.md,
    },

    name: {
        color: theme.colors.textPrimary,
        fontSize: 18,
        fontWeight: '800',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },

    stat: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceSoft,
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    statValue: {
        color: theme.colors.accent,
        fontSize: theme.typography.subtitle.fontSize,
        fontWeight: '800',
    },

    statLabel: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.small.fontSize,
        marginTop: 2,
    },

    tempoBox: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surfaceSoft,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    tempoTitle: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },

    tempoValueBig: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.accent,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },

    tempoStartBtn: {
        backgroundColor: theme.colors.accent,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    tempoStartContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    tempoStartIcon: {
        marginRight: 8,
    },

    tempoStartText: {
        color: '#000',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.3,
    },


    toggleBtn: {
        alignSelf: 'center',
        marginBottom: theme.spacing.sm,
    },

    toggleText: {
        color: theme.colors.accent,
        fontWeight: '600',
    },

    instructions: {
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderSoft,
    },

    instructionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },

    bullet: {
        color: theme.colors.accent,
        marginRight: 8,
        fontSize: theme.typography.body.fontSize,
        lineHeight: 20,
    },

    instructionText: {
        color: theme.colors.textPrimary,
        fontSize: theme.typography.small.fontSize,
        lineHeight: 20,
        flex: 1,
    },
});


export default ExerciseCard;