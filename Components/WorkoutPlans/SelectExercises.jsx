import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useExerciseStore } from '../../ZustandStores/ExerciseStore';
import { theme } from '../../Themes/index';

const SelectExercises = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { exercisesDB, setPickedExercisesTemp } = useExerciseStore();
  const selectedIds = route.params?.selectedIds || [];

  const [picked, setPicked] = useState([]);
  const [query, setQuery] = useState('');

  const availableExercises = useMemo(
    () => exercisesDB.filter(ex => !selectedIds.includes(ex.id)),
    [exercisesDB, selectedIds]
  );

  const filteredExercises = useMemo(() => {
    if (!query.trim()) return exercisesDB;
    const lowerQuery = query.toLowerCase();
    return exercisesDB.filter(ex => ex.name.toLowerCase().includes(lowerQuery) || ex.muscle_group.some(mg => mg.name.toLowerCase().includes(lowerQuery)));
  }, [query, exercisesDB]);

  const togglePick = (exercise) => {
    setPicked(prev =>
      prev.some(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const confirm = () => {
    setPickedExercisesTemp(picked);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz ćwiczenia</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Wyszukaj ćwiczenie lub grupę mięśniową"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.searchInput}
      />

      <ScrollView style={styles.list}>
        {filteredExercises.map(ex => {
          const isPicked = picked.some(p => p.id === ex.id);

          return (
            <TouchableOpacity
              key={ex.id}
              onPress={() => togglePick(ex)}
              style={[styles.item, isPicked && styles.itemPicked]}
            >
              <View style={styles.headerRow}>
                <Text style={styles.name}>{ex.name}</Text>
                <Text style={styles.badge}>{isPicked ? '✓' : '+'}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.meta}>Sprzęt: {ex.equipment}</Text>
                <Text style={styles.meta}>Typ: {ex.type}</Text>
                <Text style={styles.meta}>Poziom: {ex.difficulty}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={confirm}
        disabled={!picked.length}
        style={[styles.confirmBtn, !picked.length && styles.confirmBtnDisabled]}
      >
        <Text style={styles.confirmText}>Dodaj ({picked.length})</Text>
      </TouchableOpacity>
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
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  searchInput: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 10,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  list: {
    marginTop: theme.spacing.md,
  },

  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  itemPicked: {
    borderColor: theme.colors.accent,
    backgroundColor: '#22160D',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },

  name: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
  },

  badge: {
    color: theme.colors.accent,
    fontWeight: '700',
    fontSize: 16,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  meta: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
  },

  confirmBtn: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmBtnDisabled: {
    backgroundColor: theme.colors.disabled,
  },

  confirmText: {
    color: '#000',
    fontWeight: '700',
  },
});


export default SelectExercises;
