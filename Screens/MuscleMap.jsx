import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Front from '../Components/MuscleMap/Front.jsx';
import Rear from '../Components/MuscleMap/Rear.jsx';

const MuscleMap = ({ route })  => {
  const [view, setView] = useState('front');
  const toggleView = () => {
    view === 'front' ? setView('rear') : setView('front');
  }
    
  const muscleLoads = route.params.muscleLoads;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {view === 'front' ? <Front muscleLoads={muscleLoads} /> : <Rear muscleLoads={muscleLoads} />}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title='Rotate'
          onPress={toggleView}
        />
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