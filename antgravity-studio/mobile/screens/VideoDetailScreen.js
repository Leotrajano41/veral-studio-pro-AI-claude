import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, SafeAreaView } from 'react-native';
import { colors } from '../styles/colors';
import VideoPlayer from '../components/VideoPlayer';

export default function VideoDetailScreen({ route }) {
  const { title } = route.params || { title: 'Detalhes do Vídeo' };
  const [status, setStatus] = useState('processing');
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('done');
      setProgress(100);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Confira o vídeo criado com AntGravity Studio: ${title}`,
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <VideoPlayer videoUrl={status === 'done' ? 'https://example.com/video.mp4' : null} />

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status de Geração</Text>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, status === 'done' ? styles.doneText : styles.processingText]}>
              {status === 'done' ? '✅ Concluído' : `⏳ Processando (${progress}%)`}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Detalhes do Vídeo</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Formato:</Text>
            <Text style={styles.detailValue}>Vertical 9:16 (Shorts/Reels)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Resolução:</Text>
            <Text style={styles.detailValue}>1080x1920 (Full HD)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Voz IA:</Text>
            <Text style={styles.detailValue}>Google TTS (pt-BR Neural)</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📲 Compartilhar Vídeo</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneText: {
    color: colors.secondary,
  },
  processingText: {
    color: colors.accent,
  },
  detailsCard: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: colors.textMuted,
  },
  detailValue: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  shareButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
