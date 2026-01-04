import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import { theme } from '../../Themes/index';


const TempoInput = ({ tempo, setTempo }) => {
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [values, setValues] = useState(tempo ? tempo.split('-') : ['','','','']);

  useEffect(() => {
    setTempo(values.join('-'));
  }, [values]);

  const handleChange = (index, val) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0,1);
    let newValues = [...values];
    newValues[index] = cleaned;
    setValues(newValues);

    if (cleaned.length > 0 && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (values[index] === '' && index > 0) {
        refs[index - 1].current?.focus();
      }
    }
  };

  return (
    <View style={styles.tempoInputRow}>
      {values.map((val, i) => (
        <React.Fragment key={i}>
          <TextInput
            ref={refs[i]}
            value={val}
            onChangeText={(text) => handleChange(i, text)}
            onKeyPress={(e) => handleKeyPress(i, e)}
            keyboardType="numeric"
            style={styles.tempoInput}
            maxLength={2}
            textAlign="center"
          />
          {i < 3 && <Text style={styles.tempoDash}>-</Text>}
        </React.Fragment>
      ))}
    </View>
  )
};

const AddExercise = ({ exercise, onChange, onRemove }) => {    
    const [reps, setReps] = useState(exercise?.reps || 5);
    const [sets, setSets] = useState(exercise?.sets || 3);
    const [weight, setWeight] = useState(exercise?.weight !== undefined ? String(exercise.weight) : '');

    const [useTempo, setUseTempo] = useState(exercise?.tempo ? true : false);
    const [tempo, setTempo] = useState(exercise?.tempo || '');

    const decRepCounter = () => { setReps(prev => Math.max(prev - 1, 1)); }
    const incRepCounter = () => { setReps(prev => prev + 1); }

    const decSetCounter = () => { setSets(prev => Math.max(prev - 1, 1)); }
    const incSetCounter = () => { setSets(prev => prev + 1); }

    useEffect(() => {
        if (onChange) {
            const numericWeight = weight === '' ? 0 : Number(weight);
            onChange({ 
              reps, 
              sets, 
              weight: numericWeight, 
              tempo: useTempo ? tempo : null 
            });
        }
    }, [reps, sets, weight, tempo, useTempo]);

    const sanitizeNumber = (text) => {
        let cleaned = String(text).replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');

        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }

        let [intPart, decimalPart] = cleaned.split('.');

        if (intPart.length > 1) {
            intPart = intPart.replace(/^0+/, '');
            if (intPart === '') intPart = '0';
        }

        if (decimalPart?.length > 2) {
            decimalPart = decimalPart.slice(0, 2);
        }

        return decimalPart !== undefined ? `${intPart}.${decimalPart}` : intPart;
    };

    const handleWeightChange = (text) => {
        setWeight(sanitizeNumber(text));
    }

    const handleTempoChange = (text) => {
        const cleaned = text.replace(/[^0-9-]/g, '');
        setTempo(cleaned);
    }
    
    const CounterButton = ({ label, onPress }) => (
        <TouchableOpacity style={styles.counterBtn} onPress={onPress}>
            <Text style={styles.counterBtnText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
    <View style={styles.card}>
        <View style={styles.header}>
            <Text style={styles.name}>{exercise.name}</Text>

            <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
                <Text style={styles.removeText}>Usuń</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.row}>
            <View style={styles.column}>
                <Text style={styles.label}>Serie</Text>
                <View style={styles.counter}>
                    <CounterButton onPress={decSetCounter} label="-" />
                    <Text style={styles.value}>{sets}</Text>
                    <CounterButton onPress={incSetCounter} label="+" />
                </View>
            </View>

            <View style={styles.column}>
                <Text style={styles.label}>Powt.</Text>
                <View style={styles.counter}>
                    <CounterButton onPress={decRepCounter} label="-" />
                    <Text style={styles.value}>{reps}</Text>
                    <CounterButton onPress={incRepCounter} label="+" />
                </View>
            </View>

            <View style={styles.column}>
                <Text style={styles.label}>Kg</Text>
                <TextInput
                    value={weight}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="decimal-pad"
                    onChangeText={handleWeightChange}
                    style={styles.input}
                />
            </View>
        </View>

        <View style={styles.tempoRow}>
                <Text style={styles.label}>Dodaj tempo</Text>
                <Switch value={useTempo} onValueChange={setUseTempo} />
        </View>

        {useTempo && <TempoInput tempo={tempo} setTempo={setTempo} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  name: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  removeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },

  removeText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  column: {
    alignItems: 'center',
    flex: 1,
  },

  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },

  counterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  counterBtnText: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },

  value: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },

  input: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 60,
    textAlign: 'center',
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },

  tempoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: theme.spacing.md 
  },
    
  tempoInputRow: { 
    flexDirection: 'row', 
    marginTop: theme.spacing.sm, 
    alignItems: 'center' 
  },

  tempoInput: { 
    width: 40, 
    height: 40, 
    borderWidth: 1, 
    borderColor: theme.colors.borderSoft, 
    borderRadius: 8, marginHorizontal: 2, 
    textAlign: 'center', 
    color: theme.colors.textPrimary 
  },
    
  tempoDash: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginHorizontal: 2, 
    color: theme.colors.textMuted 
  },
});


export default AddExercise;