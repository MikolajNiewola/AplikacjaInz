import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExerciseStore } from '../ZustandStores/ExerciseStore';

const ExerciseCard = ({ item, expanded, onToggle }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <View style={styles.banner}>
        <Text style={styles.imageLabel}>{item.image}</Text>
        <Text style={styles.title}>{item.name}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onToggle(item.id)}>
        <Text style={styles.buttonText}>{expanded ? 'Ukryj' : 'Pokaż'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <Text style={styles.detailLine}>Sprzęt: {item.equipment}</Text>
          <Text style={styles.detailLine}>Typ: {item.type} • Poziom: {item.difficulty}</Text>

          <TouchableOpacity onPress={() => {navigation.navigate('Muscle Map', { exercises: [item] });}}>
            <Text style={styles.subheading}>Sprawdź mapę mięśni</Text>
          </TouchableOpacity>

          <Text style={styles.subheading}>Instrukcje:</Text>
          {item.instructions.map((inst, i) => (
            <Text key={i} style={styles.instructionLine}>{i + 1}. {inst}</Text>
          ))}

          {item.video ? (
            <Text style={styles.videoLink}>Filmik: {item.video}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const Exercises = () => {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [query, setQuery] = useState('');

  const { exercisesDB, fetchExercises } = useExerciseStore();

  useEffect(() => {
    fetchExercises();
  }, []);

  const toggle = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredExercises = useMemo(() => {
    if (!query.trim()) return exercisesDB;
    const lowerQuery = query.toLowerCase();
    return exercisesDB.filter(ex => ex.name.toLowerCase().includes(lowerQuery) || ex.muscle_group.some(mg => mg.name.toLowerCase().includes(lowerQuery)));
  }, [query, exercisesDB]);

  return (
    <View style={styles.screen}>
      
      <TextInput 
        value={query}
        onChangeText={setQuery}
        placeholder="Search Exercises"
        style={{ margin: 12, padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}
      />

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            expanded={expandedIds.has(item.id)}
            onToggle={toggle}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 12, paddingBottom: 24 },
  card: { marginBottom: 16, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e0e0e0' },
  banner: { height: 160, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  imageLabel: { position: 'absolute', top: 8, right: 8, fontSize: 12, color: '#666' },
  title: { fontSize: 18, fontWeight: '600', color: '#111', backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  button: { backgroundColor: '#007AFF', padding: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  details: { padding: 12, backgroundColor: '#fafafa' },
  detailLine: { marginBottom: 6, color: '#333' },
  subheading: { marginTop: 6, fontWeight: '600', color: '#222' },
  muscleLine: { marginLeft: 6, color: '#444' },
  instructionLine: { marginLeft: 6, color: '#444', marginTop: 4 },
  videoLink: { marginTop: 8, color: '#007AFF' },
});

export default Exercises;