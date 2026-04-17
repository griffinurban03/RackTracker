import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Auth from './components/Auth';
import { homeStyles } from './styles/homeStyles';
import { modalStyles } from './styles/modalStyles';
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

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const calculateNumColumns = Math.floor(screenWidth / 320); // Each card is around 300px wide + margin
    const numColumns = Math.min(10, Math.max(1, calculateNumColumns)); // Ensure at least 1 column and max 10
    const modalWidth = screenWidth > 900 ? screenWidth / 3 : screenWidth * 0.9;
    const modalHeight = screenHeight / 2;

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
        <View style={homeStyles.container}>
            <View style={homeStyles.headerRow}>
                <Text style={homeStyles.header}>{session?.user.user_metadata.username}'s Rack</Text>
                <TouchableOpacity onPress={() => supabase.auth.signOut()} style={homeStyles.logoutBtn}>
                    <Text style={homeStyles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={gear}
                key={`grid-${numColumns}`} // Force re-render when numColumns changes
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                columnWrapperStyle={numColumns > 1 ? homeStyles.row : undefined} // Add spacing between rows if multiple columns
                renderItem={({ item }) => (
                    <View style={homeStyles.card}>
                        <Text style={homeStyles.brandModel}>{item.brand} {item.model}</Text>
                        <Text style={homeStyles.details}>Category: {item.category}</Text>
                        <Text style={homeStyles.details}>Manufactured: {item.manufacture_date}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={homeStyles.empty}>No gear added yet.</Text>}
            />

            {/* Floating Action Button to open the Modal */}
            <TouchableOpacity style={homeStyles.fab} onPress={() => setModalVisible(true)}>
                <Text style={homeStyles.fabText}>+ Add Gear</Text>
            </TouchableOpacity>

            {/* The Add Gear Modal Form */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={modalStyles.overlay}>
                    <View style={[modalStyles.container, { width: modalWidth, height: modalHeight }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={modalStyles.header}>Add New Gear</Text>

                            <TextInput style={modalStyles.input} placeholder="Brand (e.g. Petzl)" value={brand} onChangeText={setBrand} placeholderTextColor={modalStyles.inputPlaceholder.color} />
                            <TextInput style={modalStyles.input} placeholder="Model (e.g. Grigri)" value={model} onChangeText={setModel} placeholderTextColor={modalStyles.inputPlaceholder.color} />
                            <TextInput style={modalStyles.input} placeholder="Category (e.g. Belay Device)" value={category} onChangeText={setCategory} placeholderTextColor={modalStyles.inputPlaceholder.color} />
                            <TextInput style={modalStyles.input} placeholder="Manufacture Date (YYYY-MM-DD)" value={manufactureDate} onChangeText={setManufactureDate} placeholderTextColor={modalStyles.inputPlaceholder.color} />

                            <TouchableOpacity style={modalStyles.saveBtn} onPress={addGearItem}>
                                <Text style={modalStyles.saveBtnText}>Save to Rack</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={modalStyles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={modalStyles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}