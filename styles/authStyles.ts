import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: '#f5f5f5' 
    },

    header: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 40, 
        color: '#333' 
    },

    inputContainer: { 
        marginBottom: 15 
    },

    input: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        fontSize: 16 
    },

    inputPlaceholder: { 
        color: '#666666' 
    },

    button: { 
        backgroundColor: '#2563eb', 
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginBottom: 10 
    },

    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    },

    toggleBtn: { 
        padding: 15, 
        alignItems: 'center' 
    },

    toggleText: { 
        color: '#2563eb', 
        fontSize: 14, 
        fontWeight: '600' 
    },
});