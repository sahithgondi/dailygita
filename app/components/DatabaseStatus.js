import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from '../database';

const DatabaseStatus = () => {
  const [status, setStatus] = useState('Checking...');
  const [shlokaCount, setShlokaCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      // Check if we can execute a simple query
      const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM shlokas',
            [],
            (_, { rows }) => resolve(rows._array[0]),
            (_, error) => reject(error)
          );
        });
      });

      setShlokaCount(result.count);
      setStatus('Connected');
    } catch (err) {
      console.error('Database check error:', err);
      setError(err.message);
      setStatus('Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Status</Text>
      <Text style={[
        styles.status, 
        status === 'Connected' ? styles.connected : 
        status === 'Error' ? styles.error : 
        styles.checking
      ]}>
        {status}
      </Text>
      
      {status === 'Connected' && (
        <Text style={styles.info}>
          Database contains {shlokaCount} shlokas
        </Text>
      )}
      
      {error && (
        <Text style={styles.errorMessage}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  connected: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  checking: {
    color: 'orange',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    marginTop: 8,
  },
});

export default DatabaseStatus; 