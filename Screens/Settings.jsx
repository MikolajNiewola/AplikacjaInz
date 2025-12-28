import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const importModal = (importToken, setImportToken, handleImport) => {
  return (
    <View>
      <Text>Wprowadź token aby importować dane:</Text>

      <TextInput
        value={importToken}
        onChangeText={setImportToken}
        placeholder="Token"
        maxLength={5}
      />

      <TouchableOpacity onPress={handleImport}>
        <Text>Import danych</Text>
      </TouchableOpacity>
    </View>
  );
}

const Settings = ()  => {
  const [exportToken, setExportToken] = useState('')
  const [importToken, setImportToken] = useState('')
  const [modalVisible, setModalVisible] = useState(false);

  const api = axios.create({
    baseURL: 'http://10.0.2.2:3000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handleClear = () => {
    Alert.alert("Wyczść pamięć podręczną", "Czy napewno chcesz usunąć swoje dane?\n\nTa akcja jest nieodwracalna.", [
      {
        text: "anuluj"
      },
      {
        text: "USUŃ",
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
      Alert.alert("Błąd eksportu", "Nie ma nic do wyeksportowania!", [{ text: "Ok" }]);
      return;
    };
    
    const parsed = JSON.parse(stored);
    const token = generateToken();

    await saveTokenAndData(token, parsed);

    setExportToken(token);
  }

  const handleImport = async () => {
    if (!importToken) {
      Alert.alert("Błąd importu", "Wprowadź token!", [{ text: "Ok" }]);
      return;
    }

    try {
      const response = await api.get(`/data-backup/${importToken}`);
      const data = response.data;

      await AsyncStorage.setItem('workouts', JSON.stringify(data));
      Alert.alert("Import danych", "Twoje dane zostały pomyślnie zaimportowane!", [{ text: "Ok" }]);

      await api.delete(`/data-backup/${importToken}`);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Błąd importu", "Błąd importu danych. Sprawdź token i spróbuj ponownie.", [{ text: "Ok" }]);
      console.error("Error importing data", error);
    }
  }

  return (
    <View>
        <TouchableOpacity onPress={handleClear}>
          <Text>Wyczyść pamięć podręczną</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleExport}>
          <Text>Eksportuj dane</Text>
        </TouchableOpacity>

        {exportToken && (
          <View>
            <Text>Twój token: {exportToken}</Text>
          </View>
        )}

        <TouchableOpacity onPress={() =>setModalVisible(true)}>
          <Text>Import danych</Text>
        </TouchableOpacity>

        {modalVisible && importModal(importToken, setImportToken, handleImport)}

    </View>
  );
}

export default Settings;