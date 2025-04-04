import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, TouchableOpacity } from 'react-native'; 
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TextEditorScreen() {

  const colorScheme = useColorScheme();
  const [text, setText] = useState('');
  const [subtitle, setSubtitle] = useState('Edit the document below:');
  const [folders, setFolders] = useState([
    { id: generateId(), name: 'Folder 1', documents: [{ id: generateId(), name: 'Document 1', content: 'Sample content' }] },
    { id: generateId(), name: 'Folder 2', documents: [{ id: generateId(), name: 'Document 2', content: 'Another sample document' }] },
  ]);
  const [currentDocument, setCurrentDocument] = useState<any>(null); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); 
  const [newFolderName, setNewFolderName] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');

  useEffect(() => {
    if (folders[0]?.documents.length > 0) {
      setCurrentDocument(folders[0].documents[0]);
      setText(folders[0].documents[0].content);
    }
  }, [folders]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (currentDocument) {
      setCurrentDocument((prevDoc: any) => ({ ...prevDoc, content: newText }));
    }
  };

  const handleFolderClick = (folderId: string) => {
    const folder = folders.find((folder) => folder.id === folderId);
    if (folder && folder.documents.length > 0) {
      const selectedDocument = folder.documents[0];
      setCurrentDocument(selectedDocument);
      setText(selectedDocument.content);
    }
  };

  const handleDocumentClick = (documentId: string) => {
    const document = folders
      .flatMap((folder) => folder.documents)
      .find((doc) => doc.id === documentId);
    if (document) {
      setCurrentDocument(document);
      setText(document.content);
    }
  };

  const handleNewFolder = () => {
    if (newFolderName.trim()) {
      setFolders((prevFolders) => [
        ...prevFolders,
        { id: generateId(), name: newFolderName, documents: [] },
      ]);
      setNewFolderName('');
    }
  };

  const handleNewDocument = (folderId: string) => {
    if (newDocumentName.trim()) {
      const newDocument = { id: generateId(), name: newDocumentName, content: '' };
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? { ...folder, documents: [...folder.documents, newDocument] }
            : folder
        )
      );
      setNewDocumentName('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.sidebarContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Text Editor</ThemedText>
          <ThemedText type="link" style={styles.saveButton} onPress={() => alert('Saving document...')}>Save Document</ThemedText>
        </ThemedView>

        <TouchableOpacity onPress={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <ThemedText style={styles.toggleSidebar}>{sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}</ThemedText>
        </TouchableOpacity>

        {/* Sidebar */}
        {!sidebarCollapsed && (
          <View style={styles.sidebar}>
            <ScrollView style={styles.scrollView}>
              {folders.map((folder) => (
                <View key={folder.id} style={styles.folderContainer}>
                  <TouchableOpacity
                    onPress={() => handleFolderClick(folder.id)}
                    style={styles.folderName}>
                    <ThemedText style={[styles.folderName, { color: '#242529'}]}>{folder.name}</ThemedText>
                  </TouchableOpacity>
                  <View style={styles.documentsContainer}>
                    {folder.documents.map((document) => (
                      <TouchableOpacity
                        key={document.id}
                        onPress={() => handleDocumentClick(document.id)}
                        style={[
                          styles.documentItem,
                          document.id === currentDocument?.id && styles.activeDocument, // Highlight active document
                        ]}>
                        <ThemedText style={[styles.documentItemText, { color: '#242529'}]}>{document.name}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Create new document button */}
                  <TextInput
                    value={newDocumentName}
                    onChangeText={setNewDocumentName}
                    placeholder="New document name"
                    style={styles.newItemInput}
                  />
                  <TouchableOpacity onPress={() => handleNewDocument(folder.id)}>
                    <ThemedText style={styles.createButton}>Create Document</ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Create New Folder Section */}
            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="New folder name"
              style={styles.newItemInput}
            />
            <TouchableOpacity onPress={handleNewFolder}>
              <ThemedText style={styles.createButton}>Create Folder</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ThemedView style={styles.editorContainer}>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={10}
          placeholder="Start typing here..."
          style={[styles.textInput, {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            color: Colors[colorScheme ?? 'light'].text,
          }]}
        />
      </ThemedView>
    </ThemedView>
  );
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  sidebarContainer: {
    width: 250,
    flexDirection: 'column',
    marginRight: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
  },
  saveButton: {
    fontSize: 18,
    color: '#8cba9e',
  },
  sidebar: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  toggleSidebar: {
    fontSize: 16,
    color: '#8cba9e',
    marginBottom: 10,
  },
  folderContainer: {
    marginBottom: 16,
  },
  folderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#242529',
  },
  documentsContainer: {
    marginBottom: 10,
  },
  documentItem: {
    padding: 5,
    marginBottom: 5,
    color: '#242529',
  },
  activeDocument: {
    backgroundColor: '#D3E4FF',
    borderRadius: 5,
  },
  newItemInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  createButton: {
    fontSize: 16,
    color: '#8cba9e',
  },
  editorContainer: {
    flex: 1,
    marginLeft: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
});
