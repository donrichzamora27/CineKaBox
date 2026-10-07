import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addReview } from '../storage/reviewsStorage';

const MOODS = [
  'Laughing', 'Inspired', 'Uplifted', 'Happy',
  'Creeped Out', 'Heartbroken', 'Nostalgic',
  'Romantic', 'Mind-Blown', 'Tense', 'Melancholic',
];

export default function AddReviewScreen({ navigation, route }) {
  const { mediaType, mediaId, title } = route.params || {};

  const insets = useSafeAreaInsets();

  const [rating, setRating] = useState(5);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [thoughts, setThoughts] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleMood = (mood) => {
    setSelectedMoods((prev) => {
      if (prev.includes(mood)) return prev.filter((m) => m !== mood);
      if (prev.length >= 2) return prev;
      return [...prev, mood];
    });
  };

  const handlePost = async () => {
    if (!mediaType || !mediaId) {
      navigation.goBack();
      return;
    }

    setSaving(true);

    try {
      await addReview({
        mediaType,
        mediaId,
        rating,
        moods: selectedMoods,
        thoughts,
      });
      navigation.goBack();
    } catch (e) {
      console.error('Failed to save review:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.header} numberOfLines={1}>
          {title ? `Review: ${title}` : 'Add a Review'}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.label}>Rate flick</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color="#cca218"
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>How did it make you feel?</Text>
      <Text style={styles.sublabel}>Tap to apply – up to 2 feelings</Text>

      <View style={styles.moodWrap}>
        {MOODS.map((mood) => {
          const active = selectedMoods.includes(mood);
          return (
            <TouchableOpacity key={mood} onPress={() => toggleMood(mood)}>
              {active ? (
                <LinearGradient
                  colors={['#ec4899', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.moodPill}
                >
                  <Text style={styles.moodTextActive}>{mood}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.moodPill, styles.moodPillInactive]}>
                  <Text style={styles.moodText}>{mood}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>What were your thoughts?</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write your thoughts..."
        placeholderTextColor="#6a6a6e"
        multiline
        value={thoughts}
        onChangeText={setThoughts}
      />

      <TouchableOpacity
        onPress={handlePost}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#ec4899', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.postButton, saving && { opacity: 0.7 }]}
        >
          <Text style={styles.postButtonText}>
            {saving ? 'Posting...' : 'Post Review'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090909',
    padding: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },

  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 4,
  },

  sublabel: {
    color: '#8a8a8e',
    fontSize: 12,
    marginBottom: 10,
  },

  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },

  starIcon: {
    marginHorizontal: 5,
  },

  moodWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  moodPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  moodPillInactive: {
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  moodText: {
    color: '#c8c8cd',
    fontSize: 13,
    fontWeight: '600',
  },

  moodTextActive: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  textArea: {
    backgroundColor: '#0c0c0d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 4,
  },

  postButton: {
    marginTop: 28,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  postButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});