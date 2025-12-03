import React from 'react';
import { View, Text } from 'react-native';
import { Svg, G } from 'react-native-svg';

import F_00 from '../../MuscleMapSVGs/Front/F_00_Lydki.svg';
import F_01 from '../../MuscleMapSVGs/Front/F_01_Piszczelowy.svg';
import F_02 from '../../MuscleMapSVGs/Front/F_02_Posladkowy.svg';
import F_03 from '../../MuscleMapSVGs/Front/F_03_Czworoglowy.svg';
import F_04 from '../../MuscleMapSVGs/Front/F_04_Krawiecki.svg';
import F_05 from '../../MuscleMapSVGs/Front/F_05_Przywodziciel.svg';
import F_06 from '../../MuscleMapSVGs/Front/F_06_Skosny.svg';
import F_07 from '../../MuscleMapSVGs/Front/F_07_Zebaty.svg';
import F_08 from '../../MuscleMapSVGs/Front/F_08_Przedramiona.svg';
import F_09 from '../../MuscleMapSVGs/Front/F_09_Naramienny.svg';
import F_10 from '../../MuscleMapSVGs/Front/F_10_Biceps.svg';
import F_11 from '../../MuscleMapSVGs/Front/F_11_Triceps.svg';
import F_12 from '../../MuscleMapSVGs/Front/F_12_DolnyBrzucha.svg';
import F_13 from '../../MuscleMapSVGs/Front/F_13_GornyBrzucha.svg';
import F_14 from '../../MuscleMapSVGs/Front/F_14_Piersiowy.svg';
import F_15 from '../../MuscleMapSVGs/Front/F_15_Czworoboczny.svg';
import F_16 from '../../MuscleMapSVGs/Front/F_16_MOS.svg';
import F_17 from '../../MuscleMapSVGs/Front/F_17_Bones.svg';

const layers = [
    { name: 'lydki', Component: F_00 },
    { name: 'piszczelowy', Component: F_01 },
    { name: 'posladkowy', Component: F_02 },
    { name: 'czworoglowy', Component: F_03 },
    { name: 'krawiecki', Component: F_04 },
    { name: 'przywodziciel', Component: F_05 },
    { name: 'skosny', Component: F_06 },
    { name: 'zebaty', Component: F_07 },
    { name: 'przedramiona', Component: F_08 },
    { name: 'naramienny', Component: F_09 },
    { name: 'biceps', Component: F_10 },
    { name: 'triceps', Component: F_11 },
    { name: 'dolnybrzucha', Component: F_12 },
    { name: 'gornybrzucha', Component: F_13 },
    { name: 'piersiowy', Component: F_14 },
    { name: 'czworoboczny', Component: F_15 },
    { name: 'mos', Component: F_16 },
    { name: 'bones', Component: F_17 }
];

const loadToColor = (load) => {
    if (load > 20)      { return 'rgba(255, 0, 0, 1)';     }
    else if (load > 15) { return 'rgba(255, 115, 0, 1)';  } 
    else if (load > 10) { return 'rgba(255, 172, 105, 1)';  } 
    else if (load > 5)  { return 'rgba(253, 235, 75, 1)';  }
    else if (load > 0)  { return 'rgba(120, 223, 147, 1)'; }
};

const computeFillsByName = (muscleLoads) => {
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

const Front = ({ muscleLoads }) => {
    const fills = computeFillsByName(muscleLoads);

    return (
        <View>
            <Svg width="100%" height="100%">
                {layers.map(({ name, Component }, index) => (
                    <G key={index}>
                        <Component width="100%" height="100%" fill={fills[name]} />
                    </G>
                ))}
            </Svg>
        </View>
    );
};

export default Front;