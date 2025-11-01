import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const Home = ()  => {
    const navigation = useNavigation();

  return (
    <View>
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
        <Button title="Muscle Map" onPress={() => navigation.navigate('Muscle Map')} />
        <Button title="Workout Plan" onPress={() => navigation.navigate('Workout Plan')} />
        <Button title="Exercises" onPress={() => navigation.navigate('Exercises')} />
        <Button title="Records" onPress={() => navigation.navigate('Records')} />
    </View>
  );
}

export default Home;