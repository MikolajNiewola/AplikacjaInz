import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { theme } from '../../Themes/index';

const loadToColor = (load) => {
    if (load > 20) return theme.colors.red;
    if (load > 15) return theme.colors.orange;
    if (load > 10) return theme.colors.yellow;
    if (load > 5)  return theme.colors.green;
    if (load > 0)  return theme.colors.lightGreen;
    return 'black'
};

const computeFillsByName = (layers, muscleLoads) => {
    const fills = {};
    layers.forEach((layer) => (fills[layer.name] = 'black'));

    if (!muscleLoads) return fills;

    Object.entries(muscleLoads).forEach(([name, load]) => {
        const layer = layers.find((layer) => layer.name === name);
        if (layer) fills[layer.name] = loadToColor(load);
    });

    return fills;
};

const MuscleMapSVG = ({ layers, muscleLoads }) => {
    const fills = computeFillsByName(layers, muscleLoads);

    return (
        <View style={styles.svgWrapper}>
            <Svg width="100%" height="100%">
                {layers.map(({ name, Component }, index) => (
                    <G key={index}>
                        <Component width="100%" height="100%" fill={fills[name]} stroke={theme.colors.borderSoft} strokeWidth={0.5} />
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
