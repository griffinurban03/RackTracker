import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 50, backgroundColor: '#f5f5f5' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: 'bold' },
    logoutBtn: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 6 },
    logoutText: { color: '#ef4444', fontWeight: 'bold' },
    card: { padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    brandModel: { fontSize: 18, fontWeight: '600' },
    details: { color: '#666', marginTop: 4 },
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 40 },
    fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#2563eb', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});