import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { supabase } from './utils/supabase';

// Define gear piece
interface GearItem {
    id: string;
    brand: string;
    model: string;
    category: string;
    manufacture_date: string;
}

export default function App() {
    const [gear, setGear] = useState<GearItem[]>([]);

    useEffect(() => {
        const getGear = async () => {
            try {
                const { data: gearItems, error } = await supabase.from('gear_items').select();

                if (error) {
                    console.error('Error fetching gear:', error.message);
                    return;
                }

                if (gearItems && gearItems.length > 0) {
                    setGear(gearItems as GearItem[]);
                }
            } catch (error: any) {
                console.error('Error fetching gear:', error.message);
            }
        };

        getGear();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Gear Closet</Text>
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
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    brandModel: { fontSize: 18, fontWeight: '600' },
    details: { color: '#666', marginTop: 4 },
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }
});