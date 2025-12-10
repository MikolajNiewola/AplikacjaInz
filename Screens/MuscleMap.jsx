import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MuscleMapSVG from '../Components/MuscleMap/MuscleMapSVG.jsx';
import { frontLayers, rearLayers } from '../Components/MuscleMap/MuscleMapLayers.jsx';
import baza from '../baza.json'; // do podmiany na AsyncStoarage

const aggregateMuscleLoads = (exercises) => {
  const aggregated = {};

  exercises.forEach((exercise) => {
    baza.exercises[exercise.id].muscle_group.forEach(({ name, load }) => {
      aggregated[name] = (aggregated[name] || 0) + (load || 0);
    });
  });

  return aggregated;
};

const MuscleMap = ({ route })  => {
  const [view, setView] = useState('front');
  const toggleView = () => setView((prev) => (prev === 'front' ? 'rear' : 'front'));

  const exercisesParam = route.params.exercises;
  const muscleLoads = aggregateMuscleLoads(exercisesParam);
  const currentLayers = view === 'front' ? frontLayers : rearLayers;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MuscleMapSVG layers={currentLayers} muscleLoads={muscleLoads} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title='Rotate' onPress={toggleView}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1, width: '100%' },
  buttonContainer: { padding: 8 },
});

export default MuscleMap;