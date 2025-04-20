import { Client, Account, Databases } from "react-native-appwrite";
import Constants from "expo-constants";
import { Platform } from "react-native";

// You can still use Constants.extra if you're passing secrets via app.config.js
const extra = Constants.expoConfig?.extra || {};

// Fallback to direct string if not found in config
const APPWRITE_ENDPOINT = extra.APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = extra.APPWRITE_PROJECT_ID ?? "67ff3fc5000297797a96";
const APPWRITE_BUNDLE_ID = extra.APPWRITE_BUNDLE_ID ?? "com.example.focusnotes";
const APPWRITE_PACKAGE_NAME = extra.APPWRITE_PACKAGE_NAME ?? "com.example.focusnotes.android";

// Database IDs
const DATABASE_ID = "67ff3fd9002be7657bca";
const COLLECTION_ID = "67ff3fe2001050775257";

// Appwrite client setup
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

if (Platform.OS === "ios") {
  client.setPlatform(APPWRITE_BUNDLE_ID);
} else if (Platform.OS === "android") {
  client.setPlatform(APPWRITE_PACKAGE_NAME);
} else {
  client.setPlatform("web");
}

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, DATABASE_ID, COLLECTION_ID };
