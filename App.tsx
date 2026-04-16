// App.tsx
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Auth from './components/Auth';
import { supabase } from './utils/supabase';

interface GearItem {
    id: string;
    brand: string;
    model: string;
    category: string;
    manufacture_date: string;
}

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [gear, setGear] = useState<GearItem[]>([]);

    useEffect(() => {
        // Check if a user is already logged in when the app opens
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for changes
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    // Fetch gear ONLY when a session exists
    useEffect(() => {
        if (session) {
            const getGear = async () => {
                try {
                    const { data: gearItems, error } = await supabase.from('gear_items').select();
                    if (error) throw error;
                    if (gearItems) setGear(gearItems as GearItem[]);
                } catch (error: any) {
                    console.error('Error fetching gear:', error.message);
                }
            };
            getGear();
        }
    }, [session]); // This runs every time the session changes

    // If no session, show Auth screen. If session, show App.
    if (!session && session !== undefined) {
        return <Auth />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>My Gear Closet</Text>
                {/* Simple logout button */}
                <TouchableOpacity onPress={() => supabase.auth.signOut()} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={gear}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.brandModel}>{item.brand} {item.model}</Text>
                        <Text style={styles.details}>Category: {item.category}</Text>
                        <Text style={styles.details}>Manufactured: {item.manufacture_date}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No gear added yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 50, backgroundColor: '#f5f5f5' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: 'bold' },
    logoutBtn: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 6 },
    logoutText: { color: '#ef4444', fontWeight: 'bold' },
    card: { padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    brandModel: { fontSize: 18, fontWeight: '600' },
    details: { color: '#666', marginTop: 4 },
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }
});