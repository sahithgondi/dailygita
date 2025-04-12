import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { initializeDB, setupDatabase } from './app/database';
import ShlokaList from './app/components/ShlokaList';

// Import your main navigation component or screen
// import MainNavigator from './app/navigation';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const setup = async () => {
      try {
        console.log("🔵 Starting database initialization...");
        
        // Initialize the database connection
        const db = await initializeDB();
        console.log("✅ Database connection initialized");
        
        // Setup database schema and data
        await setupDatabase();
        console.log("✅ Database setup complete");
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Database initialization error:', error);
        setDbError(error.toString());
        setIsLoading(false);
      }
    };

    setup();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading database...</Text>
      </View>
    );
  }

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Database Error</Text>
        <Text>{dbError}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bhagavad Gita</Text>
      </View>
      <ShlokaList 
        chapterId="1"
        onSelectShloka={(shloka) => {
          console.log('Selected shloka:', shloka);
          // Here you could navigate to a detail screen
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
}); 