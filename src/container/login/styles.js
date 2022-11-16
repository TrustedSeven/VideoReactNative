import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue'
    },
    successContent: {
        fontSize: 60
    },
    authInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:5
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '40%',
        fontSize: 16
    },
    authLabel: {
        fontSize: 16,
        marginRight: 20
    },
});