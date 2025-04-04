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

      <Collapsible title="Document Info">
        <ThemedText>
          This document is currently open for editing. The text area above allows you to modify the content. 
          Changes will be automatically reflected.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Save Options">
        <ThemedText>
          After editing, you can save your changes by clicking the save button below. For now, the save 
          functionality is just a placeholder.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev">Learn more about saving documents</ExternalLink>
      </Collapsible>

      <ThemedView style={styles.saveButtonContainer}>
        <ThemedText type="link" style={styles.saveButton} onPress={() => alert('Saving document...')}>
          Save Document
        </ThemedText>
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
    gap: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
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
  saveButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  saveButton: {
    fontSize: 18,
    color: '#007bff',
  },
});
