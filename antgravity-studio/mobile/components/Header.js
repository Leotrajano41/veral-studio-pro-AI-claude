import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';

export default function Header({ title = 'AntGravity Studio', onMenuPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚡ {title}</Text>
      {onMenuPress && (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Text style={styles.menuText}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: colors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    fontSize: 20,
  },
});
