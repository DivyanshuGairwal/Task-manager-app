import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Feather';

export default function ProjectCard({ project, onPress, onDelete, onEdit }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {project.title}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
            <Icon name="edit-2" size={18} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
            <Icon name="trash-2" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      {project.description ? (
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
          {project.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.badge}>
          <Icon name="check-circle" size={12} color="#10b981" />
          <Text style={styles.badgeText}>
            {project._count?.tasks || 0} Tasks
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(project.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  }
});
