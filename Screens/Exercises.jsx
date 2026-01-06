import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExerciseStore } from '../ZustandStores/ExerciseStore';
import { theme } from '../Themes/index';

const ExerciseCard = ({ item, expanded, onToggle }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <ImageBackground source={{ uri: item.image }} style={styles.banner} imageStyle={styles.bannerImage}>
                <View style={styles.bannerOverlay} />

                <View style={styles.bannerLabelContainer}>
                    <Text style={styles.bannerLabel}>{item.type}</Text>
                </View>

                <Text style={styles.title}>{item.name}</Text>
            </ImageBackground>

            <TouchableOpacity
                style={[styles.toggleBtn]}
                onPress={() => onToggle(item.id)}
            >
                <Text style={styles.toggleText}>
                    {expanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                </Text>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.details}>
                    <Text style={styles.detailLine}>
                        Sprzęt: <Text style={styles.detailValue}>{item.equipment}</Text>
                    </Text>

                    <Text style={styles.detailLine}>
                        Typ: <Text style={styles.detailValue}>{item.type}</Text> • Poziom:{' '}
                        <Text style={styles.detailValue}>{item.difficulty}</Text>
                    </Text>

                    <TouchableOpacity
                        style={styles.mapBtn}
                        onPress={() => navigation.navigate('Muscle Map', { exercises: [item] })}
                    >
                        <Text style={styles.mapBtnText}>Sprawdź mapę mięśni</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Instrukcje</Text>

                    {item.instructions.map((inst, i) => (
                        <Text key={i} style={styles.instructionLine}>
                            {i + 1}. {inst}
                        </Text>
                    ))}

                    {item.video && (
                        <Text style={styles.videoLink}>🎥 {item.video}</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const Exercises = () => {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [query, setQuery] = useState('');

    const { exercisesDB, fetchExercises } = useExerciseStore();

    useEffect(() => {
        fetchExercises();
    }, []);

    const toggle = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const levenshtein = (a, b) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = Array.from({ length: b.length + 1 }, () =>
            Array(a.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[j][i] = matrix[j - 1][i - 1];
                } else {
                    matrix[j][i] = Math.min(
                        matrix[j - 1][i] + 1,
                        matrix[j][i - 1] + 1,
                        matrix[j - 1][i - 1] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    };

    const fuzzyMatch = (query, text, maxDistance = 2) => {
        if (!text) return false;

        const q = query.toLowerCase();
        const t = text.toLowerCase();

        if (t.includes(q)) return true;

        const words = t.split(' ');

        return words.some(word =>
            levenshtein(q, word) <= maxDistance
        );
    };

    const filteredExercises = useMemo(() => {
        if (!query.trim()) return exercisesDB;

        if (query.length < 3) return exercisesDB;

        return exercisesDB.filter(ex => {
            if (fuzzyMatch(query, ex.name)) return true;

            if (ex.muscle_group?.some(mg =>
                fuzzyMatch(query, mg.name)
            )) return true;

            return false;
        });
    }, [query, exercisesDB]);

    return (
        <View style={styles.screen}>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Wyszukaj ćwiczenie lub grupę mięśniową"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.search}
            />

            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                <ExerciseCard
                    item={item}
                    expanded={expandedIds.has(item.id)}
                    onToggle={toggle}
                />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    search: {
        margin: theme.spacing.md,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceSoft,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    list: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },

    card: {
        marginBottom: theme.spacing.md,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    banner: {
        height: 140,
        backgroundColor: theme.colors.surfaceSoft,
        justifyContent: 'flex-end',
        padding: theme.spacing.md,
    },

    bannerLabelContainer: {
        position: 'absolute',
        top: 10,
        right: 12,
        backgroundColor: theme.colors.surfaceSoft,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },

    bannerLabel: {
        fontSize: 11,
        color: theme.colors.accent,
        textTransform: 'uppercase',
        fontWeight: '700',
    },

    bannerImage: {
        resizeMode: 'cover',
    },

    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    toggleBtn: {
        backgroundColor: theme.colors.surfaceSoft,
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    toggleBtnActive: {
        backgroundColor: theme.colors.accentSoft,
    },

    toggleText: {
        color: theme.colors.accent,
        fontWeight: '700',
    },

    details: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },

    detailLine: {
        color: theme.colors.textMuted,
        marginBottom: 6,
    },

    detailValue: {
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },

    mapBtn: {
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
    },

    mapBtnText: {
        color: '#fff',
        fontWeight: '800',
    },

    sectionTitle: {
        marginTop: theme.spacing.sm,
        marginBottom: 6,
        color: theme.colors.textPrimary,
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    instructionLine: {
        color: theme.colors.textMuted,
        marginTop: 4,
        lineHeight: 20,
    },

    videoLink: {
        marginTop: theme.spacing.sm,
        color: theme.colors.accent,
        fontWeight: '600',
    },
});


export default Exercises;