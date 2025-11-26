import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Button } from 'react-native';


const Home = ()  => {
    const navigation = useNavigation();

  return (
    <View>
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
        <Button title="Muscle Map" onPress={() => navigation.navigate('Muscle Map')} />
        <Button title="Workout Plans" onPress={() => navigation.navigate('Workout Plans')} />
        <Button title="Exercises" onPress={() => navigation.navigate('Exercises')} />
        <Button title="Records" onPress={() => navigation.navigate('Records')} />
    </View>
  );
}

export default Home;