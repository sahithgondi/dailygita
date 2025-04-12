import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getShlokasByChapter, toggleStarred } from '../database';

/**
 * Component to display a list of shlokas from a specific chapter
 * @param {Object} props - Component props
 * @param {string} props.chapterId - The chapter ID to display
 * @param {Function} props.onSelectShloka - Callback when a shloka is selected
 */
const ShlokaList = ({ chapterId = "1", onSelectShloka }) => {
  const [shlokas, setShlokas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShlokas();
  }, [chapterId]);

  const loadShlokas = async () => {
    try {
      setLoading(true);
      const data = await getShlokasByChapter(chapterId);
      setShlokas(data);
      setError(null);
    } catch (err) {
      console.error('Error loading shlokas:', err);
      setError('Failed to load shlokas');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStar = async (chapter_id, id) => {
    try {
      await toggleStarred(chapter_id, id);
      
      // Update local state
      setShlokas(prevShlokas => 
        prevShlokas.map(shloka => 
          shloka.chapter_id === chapter_id && shloka.id === id
            ? { ...shloka, starred: !shloka.starred }
            : shloka
        )
      );
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading shlokas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadShlokas}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (shlokas.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No shlokas found for this chapter</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.shlokaItem}
      onPress={() => onSelectShloka && onSelectShloka(item)}
    >
      <View style={styles.shlokaHeader}>
        <Text style={styles.shlokaNumber}>{item.id}</Text>
        <TouchableOpacity 
          onPress={() => handleToggleStar(item.chapter_id, item.id)}
          style={styles.starButton}
        >
          <Text style={styles.starIcon}>{item.starred ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sanskritText}>{item.shloka}</Text>
      
      {item.shloka_meaning && (
        <Text style={styles.meaning}>{item.shloka_meaning}</Text>
      )}
      
      {item.note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>{item.note}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={shlokas}
      renderItem={renderItem}
      keyExtractor={item => `${item.chapter_id}-${item.id}`}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  shlokaItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  shlokaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  shlokaNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    fontSize: 20,
    color: '#FFD700',
  },
  sanskritText: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 26,
  },
  meaning: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  noteContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  noteLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noteText: {
    color: '#555',
    fontStyle: 'italic',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ShlokaList; 