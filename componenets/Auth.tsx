import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../utils/supabase";

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle Login
    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert('Login failed', error.message);
        setLoading(false);
    }

    // Handle Sign Up
    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert('Sign Up failed', error.message);
        else if (!session) Alert.alert('Check your email', 'A confirmation link has been sent to your email address.');
        setLoading(false);
    }

    return (<View style={styles.container}>
        <Text style={styles.header}>ClimbTrack</Text>

        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
            />
        </View>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={'none'}
            />
        </View>

        <TouchableOpacity style={styles.button} disabled={loading} onPress={signInWithEmail}>
            <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.outlineButton]} disabled={loading} onPress={signUpWithEmail}>
            <Text style={styles.outlineButtonText}>Sign up</Text>
        </TouchableOpacity>
    </View>);
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
    inputContainer: { marginBottom: 15 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    button: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    outlineButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2563eb' },
    outlineButtonText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
});