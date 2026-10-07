import React from 'react';

import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockMovies } from '../mockData';

function PosterRow({ items, onPressItem }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.posterCard}
          activeOpacity={0.8}
          onPress={() => onPressItem(item)}
        >
          {item.poster_path ? (
            <Image source={{ uri: item.poster_path }} style={styles.poster} />
          ) : (
            <View style={[styles.poster, styles.noPoster]}>
              <Text style={styles.noPosterText}>No Image</Text>
            </View>
          )}

          <Text style={styles.posterTitle} numberOfLines={2}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function SectionHeader({ title, onSeeAll }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const trending = mockMovies.slice(0, 5);

  const movies = mockMovies.filter((m) => m.media_type === 'movie');
  const shows = mockMovies.filter((m) => m.media_type === 'tv');

  const openDetails = (item) => {
    navigation.navigate('Details', {
      mediaType: item.media_type,
      id: item.id,
      title: item.title || item.name,
    });
  };

  const openCategory = (category, title) => {
    navigation.navigate('Category', { category, title });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.logo}>CinekaBox</Text>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={19} color="#f5f0f0" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <SectionHeader title="Trending This Week" onSeeAll={() => openCategory('trending_movies', 'Trending')} />
        <PosterRow items={trending} onPressItem={openDetails} />

        <SectionHeader title="Popular Movies" onSeeAll={() => openCategory('popular_movies', 'Popular Movies')} />
        <PosterRow items={movies} onPressItem={openDetails} />

        <SectionHeader title="TV Shows" onSeeAll={() => openCategory('popular_tv', 'TV Shows')} />
        <PosterRow items={shows} onPressItem={openDetails} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#151212' },

  header: { paddingHorizontal: 18, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  greeting: { color: '#8e8e93', fontSize: 13 },

  logo: { color: '#ffffff', fontSize: 26, fontWeight: '900' },

  searchButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, marginTop: 18, marginBottom: 10 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },

  seeAll: { color: '#ec4899', fontSize: 13, fontWeight: '700' },

  row: { paddingHorizontal: 18, gap: 12 },

  posterCard: { width: 120 },

  poster: { width: 120, height: 180, borderRadius: 14, backgroundColor: '#1c1c20' },

  noPoster: { justifyContent: 'center', alignItems: 'center' },

  noPosterText: { color: '#666', fontSize: 11 },

  posterTitle: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 6 },
});