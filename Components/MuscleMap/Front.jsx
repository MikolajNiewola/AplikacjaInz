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
    F_00, // Lydki
    F_01, // Piszczelowy
    F_02, // Posladkowy
    F_03, // Czworoglowy
    F_04, // Krawiecki
    F_05, // Przywodziciel
    F_06, // Skosny
    F_07, // Zebaty
    F_08, // Przedramiona
    F_09, // Naramienny
    F_10, // Biceps
    F_11, // Triceps
    F_12, // DolnyBrzucha
    F_13, // GornyBrzucha
    F_14, // Piersiowy
    F_15, // Czworoboczny
    F_16, // MOS
    F_17  // Kości
]


const Front = ()  => {

  return (
    <View>
        <Svg width="100%" height="100%">
            {layers.map((Layer, index) => (
                <G key={index}>
                    <Layer width="100%" height="100%" />
                </G>
            ))}
        </Svg>
    </View>
  );
}

export default Front;