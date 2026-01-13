import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExerciseStore } from '../ZustandStores/ExerciseStore';
import { filterExercises } from '../utils/exerciseSearch';
import { theme } from '../Themes/index';
import FastImage from 'react-native-fast-image'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ExerciseListCard = ({ item, expanded, onToggle, onShowVideo }) => {
    const navigation = useNavigation();
    const primaryMuscle = item.muscles[0].name;

    return (
        <View style={styles.card}>
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.banner}
                imageStyle={styles.bannerImage}
            >
                <View style={styles.bannerOverlay} />

                <View style={styles.badges}>
                    <Text style={styles.badge}>{item.category}</Text>
                    <Text style={styles.badge}>{item.movement}</Text>
                </View>

                <Text style={styles.title}>{item.name}</Text>

                {primaryMuscle && (
                    <Text style={styles.primaryMuscle}>
                        Główna partia: {primaryMuscle}
                    </Text>
                )}
            </ImageBackground>

            <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => onToggle(item.id)}
            >
                <Text style={styles.toggleText}>
                    {expanded ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                </Text>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.details}>
                    {item.equipment?.length > 0 && (
                        <Text style={styles.detailLine}>
                            Sprzęt:{' '}
                            <Text style={styles.detailValue}>
                                {item.equipment.join(', ')}
                            </Text>
                        </Text>
                    )}

                    <Text style={styles.detailLine}>
                        Typ:{' '}
                        <Text style={styles.detailValue}>{item.type}</Text> • Poziom:{' '}
                        <Text style={styles.detailValue}>{item.difficulty}</Text>
                    </Text>

                    <TouchableOpacity
                        style={styles.mapBtn}
                        onPress={() => navigation.navigate('Muscle Map', { exercises: [item], preview: true })}
                    >
                        <Text style={styles.mapBtnText}>Sprawdź mapę mięśni</Text>
                    </TouchableOpacity>

                    {item.instructions?.length > 0 && (
                        <>
                        <Text style={styles.sectionTitle}>Instrukcje</Text>
                        {item.instructions.map((inst, i) => (
                            <Text key={i} style={styles.instructionLine}>
                            {i + 1}. {inst}
                            </Text>
                        ))}
                        </>
                    )}

                    {item.video && (
                        <View style={styles.videoSection}>
                            <Text style={styles.videoTitle}>Technika wykonania</Text>

                            <TouchableOpacity
                                style={styles.watchBtn}
                                onPress={() => onShowVideo(item)}
                            >
                                <Text style={styles.watchBtnText}><FontAwesomeIcon icon={faPlay} size={14} color={theme.colors.accent}/> Sprawdź technikę</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const Exercises = () => {
    const { exercisesDB, fetchExercises } = useExerciseStore();

    const [expandedIds, setExpandedIds] = useState(new Set());
    const [videoExercise, setVideoExercise] = useState(null);

    const [query, setQuery] = useState('');


    useEffect(() => {
        fetchExercises();
    }, []);

    const toggle = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const filteredExercises = useMemo(
        () => filterExercises(exercisesDB, query),
        [query, exercisesDB]
    );

    return (
        <View style={styles.screen}>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Wyszukaj ćwiczenie lub mięsień"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.search}
            />

            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <ExerciseListCard
                        item={item}
                        expanded={expandedIds.has(item.id)}
                        onToggle={toggle}
                        onShowVideo={(exercise) => setVideoExercise(exercise)} 
                    />
                )}
            />

            {videoExercise && (
                <View style={styles.videoOverlay}>
                    <TouchableOpacity
                        style={styles.videoBackdrop}
                        activeOpacity={1}
                        onPress={() => setVideoExercise(null)}
                    />

                    <TouchableWithoutFeedback
                        onPress={() => setVideoExercise(null)}
                    >
                        <View style={styles.videoModal}>
                            <Text style={styles.videoTitle}>
                                {videoExercise.name}
                            </Text>

                            <FastImage
                                source={{ uri: videoExercise.video }}
                                style={styles.video}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}
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
        justifyContent: 'flex-end',
        padding: theme.spacing.md,
    },

    bannerImage: {
        resizeMode: 'cover',
    },

    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    badges: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        gap: 6,
    },

    badge: {
        backgroundColor: theme.colors.surfaceSoft,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        fontSize: 11,
        color: theme.colors.accent,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },

    primaryMuscle: {
        marginTop: 4,
        color: '#ddd',
        fontSize: 12,
    },

    toggleBtn: {
        backgroundColor: theme.colors.surfaceSoft,
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    toggleText: {
        color: theme.colors.accent,
        fontWeight: '700',
    },

    details: {
        padding: theme.spacing.md,
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
    },

    instructionLine: {
        color: theme.colors.textMuted,
        marginTop: 4,
        lineHeight: 20,
    },

    videoSection: {
        marginTop: theme.spacing.md,
    },

    videoTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.textPrimary,
        marginBottom: 8,
        textTransform: 'uppercase',
    },

    watchBtn: {
        marginTop: 6,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceSoft,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
        alignItems: 'center',
    },

    watchBtnText: {
        color: theme.colors.accent,
        fontWeight: '800',
        fontSize: 14,
    },

    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    videoModal: {
        maxHeight: SCREEN_HEIGHT * 0.9,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
        alignItems: 'center',
    },

    videoTitle: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 16,
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },

    video: {
        width: '100%',
        aspectRatio: 9 / 16,
        maxHeight: SCREEN_HEIGHT * 0.7,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceSoft,
    },

    videoCloseBtn: {
        marginTop: theme.spacing.md,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceSoft,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    videoCloseText: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
    },

});

export default Exercises;
