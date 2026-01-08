import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { theme } from '../Themes/index';


const Home = () => {
    const navigation = useNavigation();

    const HomeTile = ({ label, onPress }) => (
        <TouchableOpacity
            style={[styles.tile]}
            onPress={onPress}
        >
            <Text style={styles.tileText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground 
            source={require('../assets/BackgroundImages/HomeHeader.jpg')} 
            style={styles.background} 
            imageStyle={styles.backgroundImage}
        >
            <View style={styles.overlay} />

            <View style={styles.header}>
                <View style={styles.headerTextWrapper}>
                    <Text style={styles.headerTitle}>Gotowy na trening?</Text>
                    <Text style={styles.headerSubtitle}>
                        Zrób dziś krok bliżej swojej formy
                    </Text>
                </View>

                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Workout Plans')}>
                    <Text style={styles.headerBtnText}>Zacznij trening</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                <HomeTile label="Moje Plany" onPress={() => navigation.navigate('Workout Plans')} />
                <HomeTile label="Ćwiczenia" onPress={() => navigation.navigate('Exercises')} />
                <HomeTile label="Rekordy" onPress={() => navigation.navigate('Records')} />
                <HomeTile label="Ustawienia" onPress={() => navigation.navigate('Settings')} muted />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    backgroundImage: {
        resizeMode: 'cover',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },

    header: {
        flex: 2.5,
        justifyContent: 'flex-start',
        padding: theme.spacing.lg,
    },

    headerTextWrapper: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        width: '100%',
    },

    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
    },

    headerSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
        fontSize: 14,
    },

    headerBtn: {
        marginTop: theme.spacing.md,
        backgroundColor: theme.colors.accent,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },

    headerBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },

    grid: {
        flex: 2,
        padding: theme.spacing.md,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    tile: {
        width: '48%',
        aspectRatio: 1.25,
        backgroundColor: theme.colors.surface,
        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,

        borderWidth: 1,
        borderColor: theme.colors.borderSoft,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },

    tileMuted: {
        backgroundColor: theme.colors.surfaceSoft,
    },

    tileText: {
        color: theme.colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
});


export default Home;