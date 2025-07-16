// src/screens/Settings/AestheticsSettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheming } from '../../contexts/ThemingContext';
import { aestheticsConfig } from '../../constants/aestheticsConfig';
import { Picker } from '@react-native-picker/picker';

export const AestheticsSettingsScreen: React.FC = () => {
  const { settings, updateSettings, currentTheme } = useTheming();

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.primary }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Aesthetics Settings</Text>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Theme</Text>
        <Picker
          selectedValue={settings.theme}
          style={{ height: 50, width: 150, color: currentTheme.text }}
          onValueChange={(itemValue: string) => updateSettings({ theme: itemValue as any })}
        >
          {Object.keys(aestheticsConfig.themes).map((theme) => (
            <Picker.Item key={theme} label={theme} value={theme} />
          ))}
        </Picker>
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Enable Animations</Text>
        <Switch
          value={settings.enableAnimations}
          onValueChange={(value) => updateSettings({ enableAnimations: value })}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Animation Intensity</Text>
        <Picker
          selectedValue={settings.animationIntensity}
          style={{ height: 50, width: 150, color: currentTheme.text }}
          onValueChange={(itemValue: string) => updateSettings({ animationIntensity: itemValue as any })}
        >
          {Object.keys(aestheticsConfig.animations.intensity).map((intensity) => (
            <Picker.Item key={intensity} label={intensity} value={intensity} />
          ))}
        </Picker>
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Enable Soundscapes</Text>
        <Switch
          value={settings.enableSoundscapes}
          onValueChange={(value) => updateSettings({ enableSoundscapes: value })}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Soundscape</Text>
        <Picker
          selectedValue={settings.soundscape}
          style={{ height: 50, width: 150, color: currentTheme.text }}
          onValueChange={(itemValue: string) => updateSettings({ soundscape: itemValue as any })}
        >
          {Object.keys(aestheticsConfig.soundscapes.ambient).map((soundscape) => (
            <Picker.Item key={soundscape} label={soundscape} value={soundscape} />
          ))}
        </Picker>
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Sound Volume</Text>
        <Picker
          selectedValue={settings.soundVolume}
          style={{ height: 50, width: 150, color: currentTheme.text }}
          onValueChange={(itemValue: number) => updateSettings({ soundVolume: itemValue })}
        >
          {Object.entries(aestheticsConfig.soundscapes.volume).map(([name, value]) => (
            <Picker.Item key={name} label={name} value={value} />
          ))}
        </Picker>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 16,
  },
});
