import { ID } from "appwrite";
import { databases, DATABASE_ID, COLLECTION_ID } from "./appwriteConfig";

export const createNote = async ({ title, content, folderId }) => {
  return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    FileTitle: title,
    FileContent: content,
    FolderID: folderId,
  });
};

export const updateNote = async (documentId, data) => {
  return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, data);
};

export const deleteNote = async (documentId) => {
  return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
};

export const listUserNotes = async () => {
  return await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
};
