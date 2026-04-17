import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/authStyles';
import { supabase } from '../utils/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Login Failed', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!username) {
      Alert.alert('Missing Info', 'Please enter a username.');
      return;
    }

    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username, // This saves the username into Supabase user_metadata
        }
      }
    });

    if (error) Alert.alert('Registration Failed', error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ClimbTrack</Text>
      
      {/* Only show the Username field if they are creating an account */}
      {isSignUpMode && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Display Name"
            placeholderTextColor={styles.inputPlaceholder.color}
            autoCapitalize="none"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={styles.inputPlaceholder.color}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={styles.inputPlaceholder.color}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        disabled={loading} 
        onPress={isSignUpMode ? signUpWithEmail : signInWithEmail}
      >
        <Text style={styles.buttonText}>
          {isSignUpMode ? 'Create Account' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.toggleBtn} 
        disabled={loading} 
        onPress={() => setIsSignUpMode(!isSignUpMode)}
      >
        <Text style={styles.toggleText}>
          {isSignUpMode ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}