import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TextEditorScreen() {
  const colorScheme = useColorScheme();
  const [text, setText] = useState('');

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  return (
    <ThemedView style={styles.titlecontainer}>
      <ThemedText type="title">Text Editor</ThemedText>
      <View style={styles.editorContainer}>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={10}
          placeholder="Start typing here..."
          style={[
            styles.textInput,
            {
              borderColor: Colors[colorScheme ?? 'light'].border,
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              color: Colors[colorScheme ?? 'light'].text,
            },
          ]}
        />
      </View>
      <ThemedText type="default" style={styles.previewText}>
        Preview:
      </ThemedText>
      <ThemedText style={[styles.preview, { color: Colors[colorScheme ?? 'light'].text }]}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  editorContainer: {
    marginBottom: 16,
  },
  textInput: {
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  previewText: {
    fontSize: 18,
    marginTop: 16,
  },
  preview: {
    fontSize: 16,
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});
