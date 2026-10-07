import React from 'react';

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { mockMovies } from '../mockData';

const { width } = Dimensions.get('window');

const NUM_COLUMNS = 3;
const H_PADDING = 16;
const GAP = 10;

const POSTER_WIDTH = (width - H_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function CategoryScreen({ navigation, route }) {
  const { category, title } = route.params || {};

  const getFilteredData = () => {
    switch (category) {
      case 'popular_movies':
        return mockMovies.filter(item => item.media_type === 'movie');

      case 'popular_tv':
        return mockMovies.filter(item => item.media_type === 'tv');

      case 'trending_movies':
        return mockMovies.slice(0, 5);

      default:
        return mockMovies;
    }
  };

  const items = getFilteredData();

  const openDetails = (item) => {
    navigation.navigate('Details', {
      mediaType: item.media_type || 'movie',
      id: item.id,
      title: item.title || item.name,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#10101b" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Category'}
        </Text>

        <View style={styles.backButton} />
      </View>

      {items.length === 0 ? (
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>No items found in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: GAP }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.posterCard, { width: POSTER_WIDTH }]}
              activeOpacity={0.8}
              onPress={() => openDetails(item)}
            >
              <View style={styles.posterWrapper}>
                {item.poster_path ? (
                  <Image
                    source={{ uri: item.poster_path }}
                    style={[styles.poster, { width: POSTER_WIDTH }]}
                  />
                ) : (
                  <View style={[styles.poster, styles.noPoster, { width: POSTER_WIDTH }]}>
                    <Text style={styles.noPosterText}>No Poster</Text>
                  </View>
                )}

                {item.vote_average ? (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingBadgeText}>
                      {item.vote_average.toFixed(1)}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.posterTitle} numberOfLines={1}>
                {item.title || item.name || 'Untitled'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a0c' },

  header: { paddingTop: 12, paddingHorizontal: 12, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#141416', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(225, 21, 21, 0.08)' },

  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800', marginHorizontal: 8 },

  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },

  errorText: { color: '#9a9a9e', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  grid: { paddingHorizontal: H_PADDING, paddingBottom: 40, gap: GAP },

  posterCard: { marginBottom: 16 },

  posterWrapper: { position: 'relative' },

  poster: { height: 185, borderRadius: 14, backgroundColor: '#1c1c20' },

  noPoster: { justifyContent: 'center', alignItems: 'center' },

  noPosterText: { color: '#666', fontSize: 11 },

  ratingBadge: { position: 'absolute', top: 6, left: 6, justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(10,10,12,0.75)', borderWidth: 1.5, borderColor: '#ffd54f' },

  ratingBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },

  posterTitle: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 6, lineHeight: 16 },
});