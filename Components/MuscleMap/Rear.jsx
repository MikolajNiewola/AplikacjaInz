import React from 'react';
import { View, Text } from 'react-native';
import { Svg, G } from 'react-native-svg';
import R_00 from '../../MuscleMapSVGs/Rear/R_00_Lydki.svg';
import R_01 from '../../MuscleMapSVGs/Rear/R_01_Achilles.svg';
import R_02 from '../../MuscleMapSVGs/Rear/R_02_Lydki.svg';
import R_03 from '../../MuscleMapSVGs/Rear/R_03_Czworoglowy.svg';
import R_04 from '../../MuscleMapSVGs/Rear/R_04_Przywodziciel.svg';
import R_05 from '../../MuscleMapSVGs/Rear/R_05_Dwuglowy.svg';
import R_06 from '../../MuscleMapSVGs/Rear/R_06_Posladki.svg';
import R_07 from '../../MuscleMapSVGs/Rear/R_07_Przedramiona.svg';
import R_08 from '../../MuscleMapSVGs/Rear/R_08_Triceps.svg';
import R_09 from '../../MuscleMapSVGs/Rear/R_09_Podgrzebieniowy.svg';
import R_10 from '../../MuscleMapSVGs/Rear/R_10_Oble.svg';
import R_11 from '../../MuscleMapSVGs/Rear/R_11_Naramienny.svg';
import R_12 from '../../MuscleMapSVGs/Rear/R_12_Skosny.svg';
import R_13 from '../../MuscleMapSVGs/Rear/R_13_Najszerszy.svg';
import R_14 from '../../MuscleMapSVGs/Rear/R_14_Szyja.svg';
import R_15 from '../../MuscleMapSVGs/Rear/R_15_Czworoboczny.svg';
import R_16 from '../../MuscleMapSVGs/Rear/R_16_Bones.svg';


const layers = [
    R_00, // Lydki
    R_01, // Kości
    R_02, // Lydki
    R_03, // Czworoglowy
    R_04, // Przywodziciel
    R_05, // Dwuglowy
    R_06, // Posladki
    R_07, // Przedramiona
    R_08, // Triceps
    R_09, // Podgrzebieniowy
    R_10, // Oble
    R_11, // Naramienny
    R_12, // Skosny
    R_13, // Najszerszy
    R_14, // Szyja
    R_15, // Czworoboczny
    R_16  // Kości
]


const Rear = ()  => {

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

export default Rear;
