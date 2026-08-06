import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../styles/colors';
import ProjectCard from '../components/ProjectCard';
import { setProjects, removeProject } from '../store';

const mockProjects = [
  { id: '1', name: 'Curiosidades do Espaço', niche: 'Ciência', createdAt: new Date().toISOString() },
  { id: '2', name: 'Dicas de Finanças Pessoais', niche: 'Finanças', createdAt: new Date().toISOString() },
  { id: '3', name: 'Receitas Rápidas 1 Minuto', niche: 'Culinária', createdAt: new Date().toISOString() },
];

export default function ProjectsScreen({ navigation }) {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(setProjects(mockProjects));
    }
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este projeto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => dispatch(removeProject(id)) },
      ]
    );
  };

  const filteredProjects = filter === 'Todos'
    ? projects
    : projects.filter((p) => p.niche === filter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Projetos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateVideo')}
        >
          <Text style={styles.addButtonText}>+ Criar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['Todos', 'Ciência', 'Finanças', 'Culinária'].map((niche) => (
          <TouchableOpacity
            key={niche}
            style={[styles.filterChip, filter === niche && styles.activeChip]}
            onPress={() => setFilter(niche)}
          >
            <Text style={[styles.chipText, filter === niche && styles.activeChipText]}>
              {niche}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('VideoDetail', { videoId: item.id, title: item.name })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum projeto encontrado.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  activeChipText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
});
