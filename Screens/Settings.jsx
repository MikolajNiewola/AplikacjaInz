import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';


const Settings = ()  => {
  const [exportToken, setExportToken] = useState('')
  const [importToken, setImportToken] = useState('')

  const api = axios.create({
    baseURL: 'http://10.0.2.2:3000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handleClear = () => {
    Alert.alert("Clear Local Storage", "Are you sure you want to delete your data?\nThis action is irreversible.", [
      {
        text: "cancel"
      },
      {
        text: "DELETE",
        onPress: () => { AsyncStorage.clear() }
      }
    ])
  }

  const generateToken = (lenght = 5) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < lenght; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return token;
  }

  const saveTokenAndData = async (token, data) => {
    try {
      const response = await api.post('/data-backup', {token, data });
      console.log("Added token", response.data);
    } catch (error) {
      console.error("Error saving data", error);
    }
  }

  const handleExport = async () => {
    const stored = await AsyncStorage.getItem('workouts');
    if (!stored) {
      Alert.alert("Export error", "There is nothing to export!", [{ text: "Ok" }]);
      return;
    };
    
    const parsed = JSON.parse(stored);
    const token = generateToken();

    await saveTokenAndData(token, parsed);

    setExportToken(token);
  }

  const handleImport = async () => {
    if (!importToken) {
      Alert.alert("Import error", "Please enter a valid token!", [{ text: "Ok" }]);
      return;
    }

    try {
      const response = await api.get(`/data-backup/${importToken}`);
      const data = response.data;

      await AsyncStorage.setItem('workouts', JSON.stringify(data));
      Alert.alert("Import successful", "Your data has been imported successfully!", [{ text: "Ok" }]);
    } catch (error) {
      Alert.alert("Import error", "Failed to import data. Please check the token and try again.", [{ text: "Ok" }]);
      console.error("Error importing data", error);
    }
  }

  return (
    <View>
        <Text>Settings</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text>Clear Storage</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleExport}>
          <Text>Export Data</Text>
        </TouchableOpacity>

        {exportToken && (
          <View>
            <Text>Your Token: {exportToken}</Text>
          </View>
        )}

        <TextInput
          value={importToken}
          onChangeText={setImportToken}
          placeholder="Enter Import Token"
          maxLength={5}
        />

        <TouchableOpacity onPress={handleImport}>
          <Text>Import Data</Text>
        </TouchableOpacity>
    </View>
  );
}

export default Settings;