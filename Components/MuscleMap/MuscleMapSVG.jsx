import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { theme } from '../../Themes';
import { useUserProfileStore } from '../../ZustandStores/UserProfileStore';

const VOLUME_THRESHOLDS = {
    strength: {
        low: 200,
        high: 1200,
    },
    hypertrophy: {
        low: 400,
        high: 2500,
    },
    endurance: {
        low: 800,
        high: 3500,
    },
};

const volumeToRatio = (volume, goal) => {
    if (!Number.isFinite(volume) || volume <= 0) return 0;

    const { high } =
        VOLUME_THRESHOLDS[goal] ?? VOLUME_THRESHOLDS.hypertrophy;

    const r = volume / high;

    return Math.min(Math.max(r, 0.15), 1);
};

const ratioToColor = (ratio) => {
    if (!Number.isFinite(ratio) || ratio <= 0) return 'black';

    const r = Math.min(ratio, 1.2);

    const hue = 120 - Math.min(r, 1) * 120;

    const saturation = 40 + r * 60;
    const lightness = 78 - r * 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const calculatePreviewFills = (layers, muscleRatios) => {
    const fills = {};
    layers.forEach(layer => (fills[layer.name] = 'black'));

    if (!muscleRatios) return fills;

    Object.entries(muscleRatios).forEach(([name, ratio]) => {
        if (fills[name] !== undefined) {
            fills[name] = ratioToColor(ratio);
        }
    });

    return fills;
};

const calculateVolumeFills = (layers, muscleVolumes, goal) => {
    const fills = {};
    layers.forEach(layer => (fills[layer.name] = 'black'));

    if (!muscleVolumes) return fills;

    Object.entries(muscleVolumes).forEach(([name, volume]) => {
        if (fills[name] === undefined) return;

        const ratio = volumeToRatio(volume, goal);
        fills[name] = ratioToColor(ratio);
    });

    return fills;
};

const MuscleMapSVG = ({ layers, muscleVolumes, preview = false }) => {
    const { goal } = useUserProfileStore();

    const fills = preview
        ? calculatePreviewFills(layers, muscleVolumes)
        : calculateVolumeFills(layers, muscleVolumes, goal);

    return (
        <View style={styles.svgWrapper}>
            <Svg width="100%" height="100%">
                {layers.map(({ name, Component }, index) => (
                    <G key={index}>
                        <Component
                            width="100%"
                            height="100%"
                            fill={fills[name]}
                            stroke={theme.colors.borderSoft}
                            strokeWidth={0.5}
                        />
                    </G>
                ))}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    svgWrapper: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceSoft,
        borderRadius: 20,
        overflow: 'hidden',
        padding: 16,
    },
});

export default MuscleMapSVG;
