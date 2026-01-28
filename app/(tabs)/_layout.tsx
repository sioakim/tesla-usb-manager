import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#6c757d',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#2d2d44',
          },
          default: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#2d2d44',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sounds',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lightshows"
        options={{
          title: 'Light Shows',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: 'Music',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="disc" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Setup',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
