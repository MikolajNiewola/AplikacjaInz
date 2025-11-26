import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import data from '../baza.json';

const ExerciseCard = ({ item, expanded, onToggle }) => {
  return (
    <View style={styles.card}>
      <View style={styles.banner}>
        <Text style={styles.imageLabel}>{item.image}</Text>
        <Text style={styles.title}>{item.name}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onToggle(item.id)}>
        <Text style={styles.buttonText}>{expanded ? 'Zwiń' : 'Rozwiń'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <Text style={styles.detailLine}>Sprzęt: {item.equipment}</Text>
          <Text style={styles.detailLine}>Typ: {item.type} • Poziom: {item.difficulty}</Text>

          <Text style={styles.subheading}>Instrukcje:</Text>
          {item.instructions.map((inst, i) => (
            <Text key={i} style={styles.instructionLine}>{i + 1}. {inst}</Text>
          ))}

          {item.video ? (
            <Text style={styles.videoLink}>Wideo: {item.video}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const Exercises = () => {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggle = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={data.exercises}
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