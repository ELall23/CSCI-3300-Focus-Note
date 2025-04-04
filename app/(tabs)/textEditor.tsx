import { StyleSheet, TextInput, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';

export default function TextEditorScreen() {
  const colorScheme = useColorScheme();
  const [text, setText] = useState('');
  
  // Assuming you have some API or logic to load the text document, we can use useEffect.
  useEffect(() => {
    // Load the document content here, for now we just use a placeholder
    setText("This is a sample text document. Edit me!");
  }, []);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Text Editor</ThemedText>
        <ThemedText type="link" style={styles.saveButton} onPress={() => alert('Saving document...')}>Save Document</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.editorContainer}>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={10}
          placeholder="Start typing here..."
          style={[
            styles.textInput,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              color: Colors[colorScheme ?? 'light'].text,
            },
          ]}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
  },
  saveButton: {
    fontSize: 18,
    color: '#007bff',
  },
  subtitleInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginBottom: 16,
  },
  editorContainer: {
    flex: 1, // This makes the editor section take up the remaining space
    marginBottom: 16,
  },
  textInput: {
    flex: 1, // This ensures the text input fills the available space in the editor
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
