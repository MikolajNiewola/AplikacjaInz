import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../Themes/index';


const TempoTimer = ({ route }) => {
    const { exercise } = route.params;
    const navigation = useNavigation();

    const [countdown, setCountdown] = useState(5);
    const [currentRep, setCurrentRep] = useState(1);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [finished, setFinished] = useState(false);

    const intervalRef = useRef(null);

    const neutralPhase = { name: 'Przygotuj się', bgColor: theme.colors.surfaceSoft, textColor: theme.colors.textPrimary };
    const finishPhase = { name: 'Zakończone', bgColor: theme.colors.surfaceSoft, textColor: theme.colors.textPrimary };


    const parseTempo = (tempoString) => {
        if (!tempoString) return [];
        const [ecc, pause1, conc, pause2] = tempoString.split('-').map(n => parseInt(n, 10));
        return [
            { name: 'Ekscentryka', duration: ecc, bgColor: theme.colors.accentDark, textColor: theme.colors.textPrimary },
            { name: 'Przerwa', duration: pause1, bgColor: theme.colors.surfaceSoft, textColor: theme.colors.textPrimary },
            { name: 'Koncentryka', duration: conc, bgColor: theme.colors.accentDark, textColor: theme.colors.textPrimary },
            { name: 'Przerwa', duration: pause2, bgColor: theme.colors.surfaceSoft, textColor: theme.colors.textPrimary },
        ];
    };

    const phases = parseTempo(exercise.tempo);

    useEffect(() => {
        if (finished) return;

        if (countdown > 0) {
            const cd = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(cd);
        } else {
            setTimeLeft(phases[0].duration);
            intervalRef.current = setInterval(tick, 1000);
            return () => clearInterval(intervalRef.current);
        }
    }, [countdown, finished]);

    const tick = () => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                setCurrentPhaseIndex(prevIndex => {
                if (prevIndex < phases.length - 1) {
                    setTimeLeft(phases[prevIndex + 1].duration);
                    return prevIndex + 1;
                } else {
                    setCurrentRep(prevRep => {
                    if (prevRep < exercise.reps) {
                        setCurrentPhaseIndex(0);
                        setTimeLeft(phases[0].duration);
                        return prevRep + 1;
                    } else {
                        clearInterval(intervalRef.current);
                        setFinished(true);
                        return prevRep;
                    }
                    });
                    return prevIndex;
                }
                });
                return 0;
            }
            return prev - 1;
        });
    };

    const currentPhase = finished
        ? { name: 'Gotowe!', color: theme.colors.surfaceSoft }
        : countdown > 0
        ? { name: 'Przygotuj się', color: theme.colors.surfaceSoft }
        : phases[currentPhaseIndex];

    return (
        <View style={[styles.container, { backgroundColor: 
            countdown > 0 ? neutralPhase.bgColor : 
            finished ? finishPhase.bgColor : currentPhase.bgColor
        }]}>
  
        {!finished ? (
            countdown > 0 ? (
            <View style={styles.countdownContainer}>
                <Text style={[styles.phaseName, { color: neutralPhase.textColor }]}>{neutralPhase.name}</Text>
                <Text style={[styles.countdown, { color: neutralPhase.textColor }]}>{countdown}</Text>
            </View>
            ) : (
            <>
                <Text style={[styles.repCounter, { color: currentPhase.textColor }]}>
                Powtórzenie: {currentRep} / {exercise.reps}
                </Text>
                <Text style={[styles.phaseName, { color: currentPhase.textColor }]}>{currentPhase.name}</Text>
                <Text style={[styles.timer, { color: currentPhase.textColor }]}>{timeLeft}</Text>
            </>
            )
        ) : (
            <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => navigation.goBack()}
            >
            <Text style={[styles.finishText, { color: finishPhase.textColor }]}>Wróć do planu</Text>
            </TouchableOpacity>
        )}
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  countdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdown: {
    fontSize: 80,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
  },
  repCounter: {
    position: 'absolute',
    top: theme.spacing.lg,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  phaseName: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  timer: {
    fontSize: 80,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  finishBtn: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    marginTop: theme.spacing.md,
  },
  finishText: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    fontSize: theme.typography.subtitle.fontSize,
  },
});

export default TempoTimer;
