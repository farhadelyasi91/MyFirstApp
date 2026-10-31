
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function App() {

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const [filter, setFilter] = useState('all');

  const completedCount = tasks.filter(
  item => item.completed
).length;

const totalCount = tasks.length;

const filteredTasks = tasks
  .filter(item => {

    if (filter === 'completed') {
      return item.completed;
    }

    if (filter === 'pending') {
      return !item.completed;
    }

    return true;

  })
  .sort((a, b) => {
    return Number(a.completed) - Number(b.completed);
  });


  // خواندن وظایف ذخیره‌شده
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');

      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log('خطا در خواندن وظایف:', error);
    }
  };

  // اجرا هنگام باز شدن اپلیکیشن
  useEffect(() => {
    loadTasks();
  }, []);

  // افزودن وظیفه
const addTask = async () => {

  if (task.trim() === '') {
    return;
  }

const newTask = {
  id: Date.now().toString(),
  title: task.trim(),
  completed: false,
};

  const updatedTasks = [...tasks, newTask];

  try {
    await AsyncStorage.setItem(
      'tasks',
      JSON.stringify(updatedTasks)
    );

    setTasks(updatedTasks);
    setTask('');

  } catch (error) {
    console.log('خطا در ذخیره وظیفه:', error);
  }

};

const toggleTask = async (id) => {

  const updatedTasks = tasks.map(item =>
    item.id === id
      ? { ...item, completed: !item.completed }
      : item
  );

  try {

    await AsyncStorage.setItem(
      'tasks',
      JSON.stringify(updatedTasks)
    );

    setTasks(updatedTasks);

  } catch (error) {

    console.log('خطا در تغییر وضعیت وظیفه:', error);

  }

};

  // حذف وظیفه
const deleteTask = async (id) => {

  const updatedTasks = tasks.filter(
    item => item.id !== id
  );

  try {

    await AsyncStorage.setItem(
      'tasks',
      JSON.stringify(updatedTasks)
    );

    setTasks(updatedTasks);

  } catch (error) {

    console.log('خطا در حذف وظیفه:', error);

  }

};

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        مدیریت وظایف
      </Text>

      <View style={styles.statsContainer}>

  <Text style={styles.statsText}>
    کل وظایف: {totalCount}
  </Text>

  <Text style={styles.statsText}>
    انجام‌شده: {completedCount}
  </Text>

</View>

      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="وظیفه جدید را وارد کنید..."
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>
            افزودن
          </Text>
        </TouchableOpacity>

      </View>

<View style={styles.filterContainer}>

  {/* فیلتر همه وظایف */}
  <TouchableOpacity
    style={[
      styles.filterButton,
      filter === 'all' && styles.activeFilter
    ]}
    onPress={() => setFilter('all')}
  >
<Text
  style={[
    styles.filterText,
    filter === 'all' && styles.activeFilterText
  ]}
>
  همه
</Text>
  </TouchableOpacity>

  {/* فیلتر وظایف انجام‌نشده */}
  <TouchableOpacity
    style={[
      styles.filterButton,
      filter === 'pending' && styles.activeFilter
    ]}
    onPress={() => setFilter('pending')}
  >
<Text
  style={[
    styles.filterText,
    filter === 'pending' && styles.activeFilterText
  ]}
>
  انجام‌نشده
</Text>
  </TouchableOpacity>

  {/* فیلتر وظایف انجام‌شده */}
  <TouchableOpacity
    style={[
      styles.filterButton,
      filter === 'completed' && styles.activeFilter
    ]}
    onPress={() => setFilter('completed')}
  >
<Text
  style={[
    styles.filterText,
    filter === 'completed' && styles.activeFilterText
  ]}
>
  انجام‌شده
</Text>
  </TouchableOpacity>

</View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.taskItem}>

            <TouchableOpacity
  onPress={() => toggleTask(item.id)}
>

  <Text
    style={[
      styles.taskText,
      item.completed && styles.completedTask
    ]}
  >
    {item.completed ? '✓ ' : '○ '}
    {item.title}
  </Text>

</TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteText}>
                حذف
              </Text>
            </TouchableOpacity>

          </View>

        )}

        ListEmptyComponent={
  <Text style={styles.empty}>
    {filter === 'completed'
      ? 'هنوز وظیفه انجام‌شده‌ای وجود ندارد.'
      : filter === 'pending'
      ? 'همه وظایف انجام شده‌اند.'
      : 'هنوز وظیفه‌ای ثبت نشده است.'}
  </Text>
}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#e0e7ff',
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
},

activeFilter: {
  backgroundColor: '#2563eb',
},

statsText: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#1e40af',
},

filterContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
  gap: 8,
},

filterButton: {
  flex: 1,
  backgroundColor: '#e0e7ff',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},

filterText: {
  color: '#1e40af',
  fontSize: 13,
  fontWeight: 'bold',
},

activeFilterText: {
  color: '#ffffff',
},
  
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 20,
    paddingTop: 70,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    textAlign: 'right',
  },

  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskText: {
    fontSize: 16,
    color: '#333',
  },

  completedTask: {
  textDecorationLine: 'line-through',
  color: '#999',
  },

  deleteText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },

});
