import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

    // States for our Add Gear Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('');
    const [manufactureDate, setManufactureDate] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    }, []);

    // Wrap fetch function so it can be called after login and after adding new gear
    const fetchGear = async () => {
        if (!session) return;
        try {
            const { data, error } = await supabase.from('gear_items').select();
            if (error) throw error;
            if (data) setGear(data as GearItem[]);
        } catch (error: any) {
            console.error('Error fetching gear:', error.message);
        }
    };

    useEffect(() => {
        fetchGear();
    }, [session]);

    // Function to save the new item to Supabase
    const addGearItem = async () => {
        if (!brand || !model || !category || !manufactureDate) {
            Alert.alert('Missing Info', 'Please fill out all fields.');
            return;
        }

        try {
            const { error } = await supabase.from('gear_items').insert([
                {
                    user_id: session?.user.id, // Secures the item to the logged-in user
                    brand: brand,
                    model: model,
                    category: category,
                    manufacture_date: manufactureDate, // Expects YYYY-MM-DD for now
                }
            ]);

            if (error) throw error;

            // Clear the form, close the modal, and refresh the list
            setBrand('');
            setModel('');
            setCategory('');
            setManufactureDate('');
            setModalVisible(false);
            fetchGear();

        } catch (error: any) {
            Alert.alert('Error adding gear', error.message);
        }
    };

    if (!session && session !== undefined) {
        return <Auth />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>My Gear Closet</Text>
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

            {/* Floating Action Button to open the Modal */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+ Add Gear</Text>
            </TouchableOpacity>

            {/* The Add Gear Modal Form */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Add New Gear</Text>

                    <TextInput style={styles.input} placeholder="Brand (e.g. Petzl)" value={brand} onChangeText={setBrand} />
                    <TextInput style={styles.input} placeholder="Model (e.g. Grigri)" value={model} onChangeText={setModel} />
                    <TextInput style={styles.input} placeholder="Category (e.g. Belay Device)" value={category} onChangeText={setCategory} />
                    <TextInput style={styles.input} placeholder="Manufacture Date (YYYY-MM-DD)" value={manufactureDate} onChangeText={setManufactureDate} />

                    <TouchableOpacity style={styles.saveBtn} onPress={addGearItem}>
                        <Text style={styles.saveBtnText}>Save to Closet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 40 },

    // Modal & Button Styles
    fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#2563eb', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalContainer: { flex: 1, padding: 20, marginTop: 40 },
    modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16, marginBottom: 15 },
    saveBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelBtn: { padding: 15, alignItems: 'center' },
    cancelBtnText: { color: '#ef4444', fontSize: 16 }
});