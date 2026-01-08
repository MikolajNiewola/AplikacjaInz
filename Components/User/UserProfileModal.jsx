import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { theme } from '../../Themes';
import { sanitizeNumber } from '../../utils/numberInput';
import { useUserProfileStore } from '../../ZustandStores/UserProfileStore';

const GOALS = [
    { key: 'strength', label: 'Siła', hint: 'Maksymalny ciężar i niska liczba powtórzeń' },
    { key: 'hypertrophy', label: 'Hipertrofia', hint: 'Budowa masy mięśniowej' },
    { key: 'endurance', label: 'Wytrzymałość', hint: 'Duża objętość i kondycja mięśni' },
];

const UserProfileModal = ({ visible, onClose, force = false }) => {
    const { isInitialized, saveProfile } = useUserProfileStore();

    const [ bodyweight, setBodyweight ] = useState('');
    const [ goal, setGoal ] = useState(null);

    const isForced = force && !isInitialized;

    const submit = () => {
        const bw = Number(bodyweight);

        if (!Number.isFinite(bw) || bw <= 0) return;
        if (!goal) return;

        saveProfile({ bodyweight: bw, goal });

        if (!isForced && onClose) {
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        {isForced ? 'Zanim zaczniemy' : 'Edytuj profil użytkownika'}
                    </Text>

                    <Text style={styles.label}>Twoja waga (kg)</Text>
                    <TextInput
                        value={bodyweight}
                        onChangeText={(text) => setBodyweight(sanitizeNumber(text))}
                        keyboardType="numeric"
                        placeholder="np. 80"
                        placeholderTextColor={theme.colors.textMuted}
                        style={styles.input}
                    />

                    <Text style={[styles.label, { marginTop: 16 }]}>Cel treningowy</Text>
                    {GOALS.map(g => (
                        <TouchableOpacity
                            key={g.key}
                            onPress={() => setGoal(g.key)}
                            style={[
                                styles.goalItem,
                                goal === g.key && styles.goalItemActive,
                            ]}
                        >
                            <Text style={styles.goalLabel}>{g.label}</Text>
                            <Text style={styles.goalHint}>{g.hint}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={[styles.saveBtn, (!goal || !bodyweight) && styles.saveBtnDisabled]}
                        onPress={submit}
                        disabled={!goal || !bodyweight}
                    >
                        <Text style={styles.saveText}>Zapisz</Text>
                    </TouchableOpacity>

                    {!isForced && (
                        <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
                            <Text style={styles.cancelBtn}>Anuluj</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },

    label: {
        color: theme.colors.textMuted,
        marginBottom: 6,
        fontSize: 13,
    },

    input: {
        backgroundColor: theme.colors.surfaceSoft,
        borderRadius: 10,
        padding: 12,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
    },

    goalItem: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
        marginBottom: 8,
    },

    goalItemActive: {
        borderColor: theme.colors.accent,
        backgroundColor: theme.colors.surfaceSoft,
    },

    goalLabel: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
    },

    goalHint: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 2,
    },

    saveBtn: {
        marginTop: 16,
        backgroundColor: theme.colors.accent,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    cancelBtn: { 
        color: theme.colors.textMuted, 
        textAlign: 'center' 
    },

    saveBtnDisabled: {
        backgroundColor: theme.colors.disabled,
    },

    saveText: {
        color: '#000',
        fontWeight: '800',
        fontSize: 16,
    },
});

export default UserProfileModal;