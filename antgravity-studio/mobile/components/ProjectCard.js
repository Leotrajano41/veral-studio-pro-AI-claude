import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';

export default function ProjectCard({ project, onPress }) {
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('pt-BR')
    : 'Data n/a';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailPlaceholder}>
        <Text style={styles.thumbnailText}>🎬</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.niche}>Nicho: {project.niche || 'Geral'}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  thumbnailText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  niche: {
    color: colors.primary,
    fontSize: 13,
    marginBottom: 2,
  },
  date: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
