import { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { account } from '../lib/appwriteConfig';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/textEditor');
    }
  }, [user]);

  const handleRegister = async () => {
    try {
      await account.create('unique()', email, password, name);
      await signin({ email, password });
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', error?.message ?? 'Unknown error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>Create Account</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
        style={[styles.input, { backgroundColor: Colors[colorScheme ?? 'light'].card, color: Colors[colorScheme ?? 'light'].text }]}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
        style={[styles.input, { backgroundColor: Colors[colorScheme ?? 'light'].card, color: Colors[colorScheme ?? 'light'].text }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
        style={[styles.input, { backgroundColor: Colors[colorScheme ?? 'light'].card, color: Colors[colorScheme ?? 'light'].text }]}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/signIn')}>
        <Text style={[styles.linkText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
  },
  linkHighlight: {
    fontWeight: 'bold',
    color: '#4F46E5',
  },
});
