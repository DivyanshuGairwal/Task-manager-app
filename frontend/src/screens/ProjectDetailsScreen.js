import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, RefreshControl, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/tasksSlice';
import { useTheme } from '@react-navigation/native';
import TaskItem from '../components/TaskItem';
import Icon from 'react-native-vector-icons/Feather';

export default function ProjectDetailsScreen({ route, navigation }) {
  const { project } = route.params;
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.tasks);
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(''); // simple string for now, could use a date picker
  
  // Filtering
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, COMPLETED

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    dispatch(fetchTasks(project.id));
  }, [dispatch, project.id]);

  const onRefresh = () => {
    dispatch(fetchTasks(project.id));
  };

  const openCreateModal = () => {
    setEditMode(false);
    setTitle('');
    setDueDate('');
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setEditMode(true);
    setCurrentTaskId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const taskData = { title };
    if (dueDate.trim()) {
      taskData.dueDate = new Date(dueDate).toISOString();
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (editMode) {
      dispatch(updateTask({ id: currentTaskId, data: taskData }));
    } else {
      dispatch(createTask({ projectId: project.id, data: taskData }));
    }
    setModalVisible(false);
  };

  const handleToggleStatus = (task) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    dispatch(updateTask({ id: task.id, data: { status: newStatus } }));
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          dispatch(deleteTask(id));
        }, 
        style: 'destructive' 
      },
    ]);
  };

  const filteredTasks = items.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {project.title}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {['ALL', 'PENDING', 'COMPLETED'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              filter === f ? { backgroundColor: colors.primary } : { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setFilter(f);
            }}
          >
            <Text style={[styles.filterText, filter === f ? { color: '#fff' } : { color: colors.text }]}>
              {f === 'ALL' ? 'All' : f === 'PENDING' ? 'Pending' : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && items.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="check-square" size={48} color="#888" />
              <Text style={[styles.emptyText, { color: colors.text }]}>No tasks found.</Text>
              <Text style={styles.emptySubText}>Tap + to add a task.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleStatus={() => handleToggleStatus(item)}
              onEdit={() => openEditModal(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={openCreateModal}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editMode ? 'Edit Task' : 'New Task'}
            </Text>

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Task Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Due Date (YYYY-MM-DD) Optional"
              placeholderTextColor="#888"
              value={dueDate}
              onChangeText={setDueDate}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: 'transparent' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
});
