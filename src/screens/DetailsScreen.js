import React, { useState, useCallback } from 'react';

import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockMovies } from '../mockData';

import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../storage/watchlistStorage';

import { loadReviewsForItem } from '../storage/reviewsStorage';

export default function DetailsScreen({ route, navigation }) {
  const { id, mediaType } = route.params;

  const insets = useSafeAreaInsets();

  const details = mockMovies.find(
    (m) => m.id === id && (!mediaType || m.media_type === mediaType)
  );

  const [inList, setInList] = useState(false);

  const [reviews, setReviews] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!details) return;

      isInWatchlist(details).then(setInList);

      loadReviewsForItem(details.media_type, details.id).then(setReviews);
    }, [details])
  );

  if (!details) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.overview}>Not found</Text>
      </View>
    );
  }

  const title = details.title || details.name;

  const date = details.release_date || details.first_air_date || '';

  const year = date ? date.split('-')[0] : 'Unknown';

  const toggleWatchlist = async () => {
    if (inList) {
      await removeFromWatchlist(details);
      setInList(false);
    } else {
      await addToWatchlist(details);
      setInList(true);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {details.poster_path ? (
          <Image source={{ uri: details.poster_path }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.center]}>
            <Text style={styles.overview}>No Image</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.meta}>
            {year} • {details.media_type.toUpperCase()} • ★ {details.vote_average.toFixed(1)}
          </Text>

          <Text style={styles.overview}>{details.overview}</Text>

          <TouchableOpacity onPress={toggleWatchlist} style={styles.button}>
            <Text style={styles.buttonText}>
              {inList ? 'Remove from My List' : 'Add to My List'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() =>
              navigation.navigate('AddReview', {
                mediaType: details.media_type,
                mediaId: details.id,
                title,
              })
            }
          >
            <Text style={styles.buttonText}>Write a Review</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>

          {reviews.length === 0 ? (
            <Text style={styles.overview}>No reviews yet.</Text>
          ) : (
            reviews.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <Text style={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>

                {r.moods.length > 0 && <Text style={styles.moods}>{r.moods.join(' • ')}</Text>}

                {r.thoughts ? <Text style={styles.reviewText}>{r.thoughts}</Text> : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a0c' },

  center: { justifyContent: 'center', alignItems: 'center' },

  poster: { width: '100%', height: 440, backgroundColor: '#121216' },

  content: { padding: 20 },

  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  meta: { color: '#9a9a9e', fontSize: 13, marginTop: 6 },

  overview: { color: '#b0b0b5', marginTop: 10, lineHeight: 20 },

  button: { backgroundColor: '#ec4899', padding: 15, borderRadius: 10, marginTop: 16, alignItems: 'center' },

  buttonOutline: { backgroundColor: '#141416', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', marginTop: 10 },

  buttonText: { color: '#fff', fontWeight: '700' },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 28 },

  reviewCard: { backgroundColor: '#141416', borderRadius: 12, padding: 14, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },

  stars: { color: '#ffd54f', fontSize: 16 },

  moods: { color: '#c8c8cd', fontSize: 12, marginTop: 4 },

  reviewText: { color: '#e5e5ea', marginTop: 6 },

  backButton: { position: 'absolute', left: 14, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(10,10,12,0.7)', justifyContent: 'center', alignItems: 'center' },
});