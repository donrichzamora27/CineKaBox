import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { View, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import AddReviewScreen from './src/screens/AddReviewScreen';
import CategoryScreen from './src/screens/CategoryScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function TabIcon({ name, focused, label }) {
  return (
    <View style={styles.iconWrapper}>
      {focused ? (
        <LinearGradient
          colors={['#ec4899', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircleActive}
        >
          <Ionicons name={name} size={20} color="#f2f0f0" />
        </LinearGradient>
      ) : (
        <View style={styles.iconCircle}>
          <Ionicons name={name} size={20} color="#8d8d99" />
        </View>
      )}

      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'film' : 'film-outline'} focused={focused} label="Home" />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} label="Search" />,
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'bookmark' : 'bookmark-outline'} focused={focused} label="Watch List" />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />

        <RootStack.Screen name="Details" component={DetailsScreen} />
        <RootStack.Screen name="Category" component={CategoryScreen} />

        <RootStack.Screen
          name="AddReview"
          component={AddReviewScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 18,
    right: 18,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#141416',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    elevation: 12,
    paddingTop: 7,
    paddingBottom: 7,
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },

  iconCircle: {
    width: 36,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircleActive: {
    width: 36,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    color: '#8d8d99',
  },

  tabLabelActive: {
    color: '#fff',
    fontWeight: '800',
  },
});