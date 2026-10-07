import React, { useState, useCallback } from 'react';

import { View, FlatList, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MovieCard from '../components/MovieCard';

import { loadWatchlist, removeFromWatchlist } from '../storage/watchlistStorage';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV' },
];

export default function WatchlistScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [watchlist, setWatchlist] = useState([]);

  const [filter, setFilter] = useState('all');

  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadWatchlist().then((data) => setWatchlist(data || []));

      return () => {
        setIsSelectionMode(false);
        setSelectedIds([]);
      };
    }, [])
  );

  const filteredWatchlist = watchlist.filter((item) =>
    filter === 'all' ? true : item.media_type === filter
  );

  const allSelected =
    filteredWatchlist.length > 0 && selectedIds.length === filteredWatchlist.length;

  const exitSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : filteredWatchlist.map((i) => i.id));
  };

  const handleBatchDelete = () => {
    Alert.alert('Remove Titles', `Remove ${selectedIds.length} item(s)?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          let updated = watchlist;

          for (const id of selectedIds) {
            const target = updated.find((i) => i.id === id);

            if (target) updated = await removeFromWatchlist(target);
          }

          setWatchlist(updated);
          exitSelection();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>

      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>My List</Text>

        {watchlist.length > 0 && (
          <TouchableOpacity
            onPress={isSelectionMode ? exitSelection : () => setIsSelectionMode(true)}
            style={styles.headerIconButton}
          >
            <Text style={styles.selectActionText}>{isSelectionMode ? 'Cancel' : 'Select'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterButton, filter === cat.id ? styles.filterButtonActive : styles.filterButtonInactive]}
              onPress={() => {
                setFilter(cat.id);
                setSelectedIds([]);
              }}
            >
              <Text style={filter === cat.id ? styles.activeFilterButtonText : styles.filterButtonText}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredWatchlist.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Ionicons name="bookmark-outline" size={32} color="#3a3a3e" />
          <Text style={styles.emptyText}>Your list is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredWatchlist}
          keyExtractor={(item) => item.id.toString()}
          extraData={[isSelectionMode, selectedIds]}
          contentContainerStyle={{ paddingBottom: isSelectionMode ? 190 : 120 }}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <View style={styles.itemContainer}>
                <MovieCard
                  item={item}
                  onPress={() => {
                    if (isSelectionMode) toggleSelectItem(item.id);
                    else navigation.navigate('Details', { id: item.id, mediaType: item.media_type });
                  }}
                />

                {isSelectionMode && (
                  <View pointerEvents="none" style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                )}
              </View>
            );
          }}
        />
      )}

      {isSelectionMode && (
        <View style={styles.batchBar}>
          <View>
            <Text style={styles.batchCountText}>{selectedIds.length} Selected</Text>
            <TouchableOpacity onPress={toggleSelectAll}>
              <Text style={styles.selectAllText}>{allSelected ? 'Deselect all' : 'Select all'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.deleteButton, selectedIds.length === 0 && styles.deleteButtonDisabled]}
            disabled={selectedIds.length === 0}
            onPress={handleBatchDelete}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0c', paddingHorizontal: 8 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 16 },

  headerIconButton: { padding: 8 },

  screenTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },

  selectActionText: { color: '#ec4899', fontSize: 16, fontWeight: '700' },

  filterContainer: { height: 42, marginBottom: 12 },

  filterRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, alignItems: 'center' },

  filterButton: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },

  filterButtonInactive: { backgroundColor: '#141416', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },

  filterButtonActive: { backgroundColor: '#ec4899' },

  filterButtonText: { color: '#c8c8cd', fontSize: 13, fontWeight: '600' },

  activeFilterButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },

  itemContainer: { position: 'relative' },

  checkbox: { position: 'absolute', right: 22, top: 18, width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },

  checkboxSelected: { backgroundColor: '#ec4899', borderColor: '#ec4899' },

  emptyWrapper: { alignItems: 'center', marginTop: 70, gap: 8 },

  emptyText: { color: '#c8c8cd', textAlign: 'center', fontSize: 15, fontWeight: '600' },

  batchBar: { position: 'absolute', bottom: 96, left: 16, right: 16, backgroundColor: '#18181c', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },

  batchCountText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  selectAllText: { color: '#ec4899', fontSize: 13, fontWeight: '700', marginTop: 2 },

  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },

  deleteButtonDisabled: { opacity: 0.4 },

  deleteButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});