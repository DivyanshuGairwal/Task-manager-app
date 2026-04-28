import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function TaskItem({ task, onToggleStatus, onDelete, onEdit }) {
  const { colors } = useTheme();
  const isCompleted = task.status === 'COMPLETED';

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity onPress={onToggleStatus} style={styles.checkbox}>
        <Icon 
          name={isCompleted ? 'check-circle' : 'circle'} 
          size={24} 
          color={isCompleted ? '#10b981' : '#888'} 
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            { color: colors.text, textDecorationLine: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.6 : 1 }
          ]}
        >
          {task.title}
        </Text>
        {task.dueDate && (
          <Text style={styles.dateText}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
          <Icon name="edit-2" size={18} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
          <Icon name="trash-2" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  checkbox: {
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4,
  },
});
