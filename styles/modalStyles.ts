import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 40 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16, marginBottom: 15 },
    inputPlaceholder: { color: '#666666' },
    saveBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelBtn: { padding: 15, alignItems: 'center' },
    cancelBtnText: { color: '#ef4444', fontSize: 16 }
});