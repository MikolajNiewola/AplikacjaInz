import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../../Themes/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare';

const ContextMenu = ({ plan, onDelete, onEdit, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} onPress={onClose} />

      <Animated.View style={[styles.menu, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>{plan.name}</Text>

        <TouchableOpacity style={styles.button} onPress={() => { onEdit(plan); onClose(); }}>
            <FontAwesomeIcon icon={faPenToSquare} style={{color: '#fff', marginRight: 5}}/>
            <Text style={styles.buttonText}>Edytuj plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => { onDelete(plan); onClose(); }}>
            <FontAwesomeIcon icon={faTrashCan} style={{color: '#fff', marginRight: 5}}/>
            <Text style={styles.buttonText}>Usuń plan</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={{ marginTop: theme.spacing.sm }}>
            <Text style={styles.cancel}>Anuluj</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    justifyContent: 'center',
  },
  delete: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancel: {
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default ContextMenu;
