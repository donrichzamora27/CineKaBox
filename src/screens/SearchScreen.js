import React, { useState } from 'react';

import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MovieCard from '../components/MovieCard';

import { mockMovies } from '../mockData';

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');

  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);

    const q = text.trim().toLowerCase();

    if (q === '') {
      setResults([]);
    } else {
      setResults(
        mockMovies.filter((movie) =>
          (movie.title || movie.name || '').toLowerCase().includes(q)
        )
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.screenTitle}>Search</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={18} color="#8a8a8e" style={styles.inputIcon} />

        <TextInput
          style={styles.input}
          placeholder="Search movies and TV..."
          placeholderTextColor="#8a8a8e"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
        ListEmptyComponent={
          query.trim() !== '' ? <Text style={styles.emptyText}>No results found.</Text> : null
        }
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            onPress={() => navigation.navigate('Details', { id: item.id, mediaType: item.media_type })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0c', paddingHorizontal: 8 },

  screenTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 14, marginLeft: 8 },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141416', borderRadius: 12, paddingHorizontal: 12, marginHorizontal: 8 },

  inputIcon: { marginRight: 8 },

  input: { flex: 1, color: '#fff', paddingVertical: 12 },

  emptyText: { color: '#9a9a9e', textAlign: 'center', marginTop: 40, fontSize: 14 },
});