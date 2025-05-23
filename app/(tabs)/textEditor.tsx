import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View, ScrollView, TouchableOpacity } from 'react-native'; 
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { createNote, updateNote, listUserNotes } from '@/lib/noteService';
import Markdown from 'react-native-markdown-display'; // ✅ For Markdown rendering

export default function TextEditorScreen() {
  const colorScheme = useColorScheme();
  const { user, signout } = useAuth();
  const router = useRouter();
  const [text, setText] = useState('');
  const textRef = useRef(''); // ✅ Fresh text tracking
  const [folders, setFolders] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); 
  const [newFolderId, setNewFolderId] = useState('');
  const [newDocumentNames, setNewDocumentNames] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (user === null) {
      router.replace('/signIn');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    const res = await listUserNotes();
    const structured = groupByFolder(res.documents);
    setFolders(structured);

    if (!currentDocument && structured[0]?.documents.length > 0) {
      const doc = structured[0].documents[0];
      setCurrentDocument(doc);
      setText(doc.FileContent);
      textRef.current = doc.FileContent; // ✅ Sync ref
    }
  };

  const handleTextChange = (newText) => {
    setText(newText);
    textRef.current = newText; // ✅ Keep textRef always up to date

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);
  };

  const handleSave = async () => {
    if (currentDocument?.$id) {
      await updateNote(currentDocument.$id, { FileContent: textRef.current }); // ✅ Save freshest text
    }
  };

  const handleFolderClick = (folderId) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder?.documents.length > 0) {
      const doc = folder.documents[0];
      setCurrentDocument(doc);
      setText(doc.FileContent);
      textRef.current = doc.FileContent; // ✅ Sync ref
    }
  };

  const handleDocumentClick = (docId) => {
    const doc = folders.flatMap(f => f.documents).find(d => d.$id === docId);
    if (doc) {
      setCurrentDocument(doc);
      setText(doc.FileContent);
      textRef.current = doc.FileContent; // ✅ Sync ref
    }
  };

  const handleDocumentNameChange = (folderId, name) => {
    setNewDocumentNames(prev => ({ ...prev, [folderId]: name }));
  };

  const handleNewDocument = async (folderId) => {
    const documentName = newDocumentNames[folderId];
    if (documentName?.trim()) {
      const newDoc = await createNote({
        title: documentName,
        content: '',
        folderId: parseInt(folderId),
      });

      const fullDoc = {
        $id: newDoc.$id,
        FileTitle: documentName,
        FileContent: '',
        FolderID: parseInt(folderId),
      };

      setCurrentDocument(fullDoc);
      setText('');
      textRef.current = ''; // ✅ Reset ref
      setNewDocumentNames(prev => ({ ...prev, [folderId]: '' }));
      fetchNotes();
    }
  };

  const handleNewFolder = () => {
    if (newFolderId.trim()) {
      setFolders(prev => [...prev, {
        id: parseInt(newFolderId),
        name: `Folder ${newFolderId}`,
        documents: []
      }]);
      setNewFolderId('');
    }
  };

  const groupByFolder = (docs) => {
    const map = {};
    for (let doc of docs) {
      const fid = doc.FolderID;
      if (!map[fid]) {
        map[fid] = { id: fid, name: `Folder ${fid}`, documents: [] };
      }
      map[fid].documents.push(doc);
    }
    return Object.values(map);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.headerBar, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ThemedText type="title" style={styles.headerTitle}>Text Editor</ThemedText>

        <TouchableOpacity onPress={signout} style={styles.logoutButton}>
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sidebarContainer}>
          <TouchableOpacity onPress={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <ThemedText style={styles.toggleSidebar}>
              {sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
            </ThemedText>
          </TouchableOpacity>

          {!sidebarCollapsed && (
            <View style={styles.sidebar}>
              <ScrollView style={styles.scrollView}>
                {folders.map((folder) => (
                  <View key={folder.id} style={styles.folderContainer}>
                    <TouchableOpacity onPress={() => handleFolderClick(folder.id)}>
                      <ThemedText style={styles.folderName}>{folder.name}</ThemedText>
                    </TouchableOpacity>
                    <View style={styles.documentsContainer}>
                      {folder.documents.map((doc) => (
                        <TouchableOpacity
                          key={doc.$id}
                          onPress={() => handleDocumentClick(doc.$id)}
                          style={[styles.documentItem, doc.$id === currentDocument?.$id && styles.activeDocument]}>
                          <ThemedText style={{ color: '#242529' }}>{doc.FileTitle}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      value={newDocumentNames[folder.id] || ''}
                      onChangeText={(text) => handleDocumentNameChange(folder.id, text)}
                      placeholder="New document name"
                      style={styles.newItemInput}
                    />
                    <TouchableOpacity onPress={() => handleNewDocument(folder.id)}>
                      <ThemedText style={styles.createButton}>Create Document</ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TextInput
                value={newFolderId}
                onChangeText={setNewFolderId}
                placeholder="Enter folder ID"
                style={styles.newItemInput}
              />
              <TouchableOpacity onPress={handleNewFolder}>
                <ThemedText style={styles.createButton}>Create Folder</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ThemedView style={styles.editorContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsFocused(true)}
            style={{ flex: 1 }}
          >
            {isFocused ? (
              <TextInput
                value={text}
                onChangeText={handleTextChange}
                multiline
                numberOfLines={10}
                autoFocus
                onBlur={() => setIsFocused(false)}
                placeholder="Start typing here..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
                style={[styles.textInput, {
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: '#ccc',
                }]}
              />
            ) : (
              <ScrollView style={{ flex: 1 }}>
                <Markdown
                  style={{
                    body: { color: Colors[colorScheme ?? 'light'].text, fontSize: 16, padding: 10 },
                    heading1: { color: Colors[colorScheme ?? 'light'].text },
                    heading2: { color: Colors[colorScheme ?? 'light'].text },
                    strong: { color: Colors[colorScheme ?? 'light'].text },
                    em: { color: Colors[colorScheme ?? 'light'].text },
                  }}
                >
                  {text || '*Click to start editing...*'}
                </Markdown>
              </ScrollView>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} style={styles.saveButtonContainer}>
            <ThemedText style={styles.saveButton}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: { fontSize: 24 },
  logoutButton: { backgroundColor: '#FF7070', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  logoutText: { color: 'white', fontSize: 16 },
  mainContent: { flex: 1, flexDirection: 'row' },
  sidebarContainer: { width: 250, borderRightWidth: 1, borderRightColor: '#ccc', padding: 10 },
  toggleSidebar: { fontSize: 16, color: '#8cba9e', marginBottom: 10 },
  sidebar: { flex: 1 },
  folderContainer: { marginBottom: 16 },
  folderName: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#242529' },
  documentsContainer: { marginBottom: 10 },
  documentItem: { padding: 2, marginBottom: 1 },
  activeDocument: { backgroundColor: '#D3E4FF', borderRadius: 5 },
  newItemInput: { height: 40, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 8 },
  createButton: { fontSize: 16, color: '#8cba9e' },
  editorContainer: { flex: 1, padding: 20 },
  textInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  scrollView: { flex: 1 },
  saveButtonContainer: { marginTop: 10, alignItems: 'flex-end' },
  saveButton: { fontSize: 16, color: '#8cba9e', padding: 8 },
});
