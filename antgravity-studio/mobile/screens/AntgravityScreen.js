import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../styles/colors';

export default function AntgravityScreen() {
  const logs = [
    { id: '1', text: '[SDK] Conectado à Antgravity Engine v2.4', time: '10:00:15' },
    { id: '2', text: '[Otimização] Cache de mídias reindexado (+45% velocidade)', time: '10:02:40' },
    { id: '3', text: '[Deploy] Auto-deploy do microserviço de TTS efetuado', time: '10:15:00' },
    { id: '4', text: '[Performance] Latência média das chamadas: 120ms', time: '10:30:12' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Antgravity Engine</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status do Sistema</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>Engine Core:</Text>
            <Text style={styles.onlineBadge}>🟢 Operacional</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>Pipeline de Renderização:</Text>
            <Text style={styles.onlineBadge}>🟢 Operacional</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Logs de Otimização & Deploys</Text>
        {logs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <Text style={styles.logTime}>{log.time}</Text>
            <Text style={styles.logText}>{log.text}</Text>
          </View>
        ))}
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
  card: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusText: {
    color: colors.textSecondary,
  },
  onlineBadge: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logCard: {
    backgroundColor: colors.cardBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  logTime: {
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  logText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
});
