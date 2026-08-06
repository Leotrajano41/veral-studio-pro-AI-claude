import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/colors';

export default function VideoPlayer({ videoUrl }) {
  const handleDownload = () => {
    Alert.alert('Download', `Iniciando download do vídeo: ${videoUrl || 'Mídia local'}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.placeholderIcon}>▶️</Text>
        <Text style={styles.placeholderText}>
          {videoUrl ? 'Vídeo Carregado' : 'Aguardando renderização...'}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Play', 'Reproduzindo vídeo')}>
          <Text style={styles.buttonText}>▶️ Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.downloadButton]} onPress={handleDownload}>
          <Text style={styles.buttonText}>⬇️ Baixar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  screen: {
    width: '100%',
    height: 220,
    backgroundColor: colors.black,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: colors.cardBg,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  downloadButton: {
    marginRight: 0,
    marginLeft: 6,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
