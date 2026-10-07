import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MovieCard({ item, onPress }) {
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date || 'Unknown'; 
  const year = date !== 'Unknown' ? date.split('-')[0] : 'Unknown'; 

  const poster = item.poster_path ? item.poster_path : null; 
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const mediaType = item.media_type ? item.media_type.toUpperCase() : 'MEDIA';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.posterWrapper}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text style={styles.noPosterText}>No Image</Text>
          </View>
        )}

        {rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.date}>{year}</Text>
        </View>

        <View style={styles.footer}>
          <LinearGradient
            colors={['#ec4899', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.typePill}
          >
            <Text style={styles.type}>{mediaType}</Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', 
    backgroundColor: '#0c0c0e',
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(241, 229, 229, 0.06)',
    elevation: 6,
  },

  posterWrapper: {
    position: 'relative',
  },

  poster: {
    width: 100,
    height: 150,
    backgroundColor: '#232326',
  },

  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  noPosterText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },

  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1.5,
    borderColor: '#ffd54f',
  },

  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },

  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  date: {
    color: '#9a9a9e',
    fontSize: 13,
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    marginTop: 8,
  },

  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  type: {
    color: '#f7f1f1',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});