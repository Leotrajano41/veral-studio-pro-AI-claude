import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';
import { storage } from '../services/storage';

export default function SettingsScreen() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const keys = await storage.getApiKeys();
    setOpenaiKey(keys.openaiKey || '');
    setGoogleKey(keys.googleKey || '');
  };

  const handleSaveKeys = async () => {
    await storage.saveApiKeys({ openaiKey, googleKey });
    Alert.alert('Sucesso', 'Configurações de API salvas com sucesso.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Sessão encerrada.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chaves de API</Text>

          <Text style={styles.label}>OpenAI API Key</Text>
          <TextInput
            style={styles.input}
            placeholder="sk-..."
            placeholderTextColor={colors.textMuted}
            value={openaiKey}
            onChangeText={setOpenaiKey}
            secureTextEntry
          />

          <Text style={styles.label}>Google Cloud API Key</Text>
          <TextInput
            style={styles.input}
            placeholder="AIza..."
            placeholderTextColor={colors.textMuted}
            value={googleKey}
            onChangeText={setGoogleKey}
            secureTextEntry
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveKeys}>
            <Text style={styles.saveButtonText}>Salvar Chaves</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Modo Escuro (Dark Mode)</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.infoText}>AntGravity Studio Mobile v1.0.0</Text>
          <Text style={styles.infoText}>Desenvolvido com Expo & React Native</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  section: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: colors.textPrimary,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
