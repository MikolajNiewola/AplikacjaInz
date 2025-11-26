import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const Settings = ()  => {

  return (
    <View>
        <Text>Settings</Text>
        <TouchableOpacity onPress={() => AsyncStorage.clear()}>
          <Text>Clear Storage</Text>
        </TouchableOpacity>
    </View>
  );
}

export default Settings;