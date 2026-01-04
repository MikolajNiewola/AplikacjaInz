import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { theme } from '../Themes/index';

const ImportModal = ({ importToken, setImportToken, handleImport, onClose }) => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Import danych</Text>

        <Text style={styles.modalText}>
          Wprowadź token aby przywrócić dane
        </Text>

        <TextInput
          value={importToken}
          onChangeText={setImportToken}
          placeholder="TOKEN"
          placeholderTextColor={theme.colors.textMuted}
          maxLength={5}
          style={styles.tokenInput}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleImport}>
          <Text style={styles.primaryText}>Importuj</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Anuluj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    <View style={styles.container}>
      <Text style={styles.title}>Ustawienia</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kopia zapasowa</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleExport}>
          <Text style={styles.primaryText}>Eksportuj dane</Text>
        </TouchableOpacity>

        {exportToken && (
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>Twój token</Text>
            <Text style={styles.tokenValue}>{exportToken}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.secondaryText}>Import danych</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dane aplikacji</Text>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleClear}>
          <Text style={styles.dangerText}>Wyczyść pamięć aplikacji</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && (
        <ImportModal
          importToken={importToken}
          setImportToken={setImportToken}
          handleImport={handleImport}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },

  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 14,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },

  cardTitle: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },

  primaryBtn: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },

  secondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  secondaryText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },

  dangerBtn: {
    borderWidth: 1,
    borderColor: theme.colors.danger,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  dangerText: {
    color: theme.colors.danger,
    fontWeight: '700',
  },

  tokenBox: {
    marginVertical: theme.spacing.sm,
    alignItems: 'center',
  },

  tokenLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },

  tokenValue: {
    color: theme.colors.accent,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },

  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },

  modalText: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },

  tokenInput: {
    backgroundColor: theme.colors.surfaceSoft,
    color: theme.colors.textPrimary,
    borderRadius: 10,
    padding: 12,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 3,
    marginBottom: theme.spacing.md,
  },

  cancelText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
});


export default Settings;