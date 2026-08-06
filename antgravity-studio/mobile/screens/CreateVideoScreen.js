import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';

export default function CreateVideoScreen({ navigation }) {
  const [tema, setTema] = useState('');
  const [nicho, setNicho] = useState('Finanças');
  const [idioma, setIdioma] = useState('pt-BR');
  const [duracao, setDuracao] = useState('60');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!tema.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o tema do vídeo.');
      return;
    }

    setLoading(true);
    try {
      // Simulação da chamada de API
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Sucesso!', 'A geração do vídeo foi iniciada com sucesso.', [
          {
            text: 'Acompanhar Status',
            onPress: () => navigation.navigate('VideoDetail', { videoId: 'new_video_123', title: tema }),
          },
        ]);
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', error.message || 'Falha ao iniciar geração');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar Novo Vídeo</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tema do Vídeo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5 Segredos para Investir Melhor em 2026"
            placeholderTextColor={colors.textMuted}
            value={tema}
            onChangeText={setTema}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nicho de Conteúdo</Text>
          <View style={styles.optionsRow}>
            {['Finanças', 'Ciência', 'Tecnologia', 'Saúde'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.optionChip, nicho === item && styles.selectedChip]}
                onPress={() => setNicho(item)}
              >
                <Text style={[styles.optionText, nicho === item && styles.selectedText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Idioma</Text>
          <View style={styles.optionsRow}>
            {['pt-BR', 'en-US', 'es-ES'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.optionChip, idioma === item && styles.selectedChip]}
                onPress={() => setIdioma(item)}
              >
                <Text style={[styles.optionText, idioma === item && styles.selectedText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duração Estimada (segundos)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duracao}
            onChangeText={setDuracao}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>✨ Gerar Vídeo com IA</Text>
          )}
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
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    padding: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionChip: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
