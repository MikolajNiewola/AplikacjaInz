import React from 'react';
import { View } from 'react-native';
import { Svg, G } from 'react-native-svg';

const loadToColor = (load) => {
    if (load > 20) return 'rgba(255, 0, 0, 1)';
    if (load > 15) return 'rgba(255, 115, 0, 1)';
    if (load > 10) return 'rgba(255, 172, 105, 1)';
    if (load > 5)  return 'rgba(255, 247, 160, 1)';
    if (load > 0)  return 'rgba(120, 223, 147, 1)';
    return 'black';
};

const computeFillsByName = ( layers, muscleLoads) => {
    const fills = {};
    layers.forEach((layer) => (fills[layer.name] = 'black'));

    if (!muscleLoads) return fills;

    let list = [];
    list = Object.entries(muscleLoads).map(([name, load]) => ({ name, load }));


    list.forEach((entry) => {
        const layer = layers.find((layer) => layer.name === entry.name);
        if (layer) fills[layer.name] = loadToColor(entry.load);
    });

    return fills;
};

const MuscleMapSVG = ({ layers, muscleLoads }) => {
    const fills = computeFillsByName(layers, muscleLoads);

        return (
        <View>
            <Svg width="100%" height="100%">
                {layers.map(({ name, Component }, index) => (
                    <G key={index}>
                        <Component width="100%" height="100%" fill={fills[name]} stroke='black'/>
                    </G>
                ))}
            </Svg>
        </View>
    );
};

export default MuscleMapSVG;