import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Switch, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTOSAVE_INTERVAL_MS = 5000;

export default function AutoSaveNote() {
  const [note, setNote] = useState('');
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  const intervalIdRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const savedNote = await AsyncStorage.getItem('focusnote_userNote');
        if (savedNote !== null) {
          setNote(savedNote);
        }
      } catch (error) {
        console.log('Error loading note:', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (isAutoSaveEnabled) {
      intervalIdRef.current = setInterval(() => {
        handleSaveNote();
      }, AUTOSAVE_INTERVAL_MS);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isAutoSaveEnabled]);

  const handleSaveNote = async () => {
    try {
      await AsyncStorage.setItem('focusnote_userNote', note);
      console.log('Note autosaved:', note);
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };

  const handleToggleAutoSave = () => {
    setIsAutoSaveEnabled(!isAutoSaveEnabled);
  };

  const handleDeleteNote = async () => {
    try {
      await AsyncStorage.removeItem('focusnote_userNote');
      setNote(''); // Clear the note in the UI
      console.log('Note deleted');
    } catch (error) {
      console.log('Error deleting note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Autosave is {isAutoSaveEnabled ? 'ON' : 'OFF'}
      </Text>
      <Switch
        onValueChange={handleToggleAutoSave}
        value={isAutoSaveEnabled}
        style={styles.switch}
      />

      <TextInput
        style={styles.input}
        multiline
        placeholder="Type your note here..."
        value={note}
        onChangeText={(text) => setNote(text)}
      />

      <Button title="Delete Save" onPress={handleDeleteNote} color="#ff4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 18,
  },
  switch: {
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});