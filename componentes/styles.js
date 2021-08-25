import {StyleSheet} from "react-native";

export default StyleSheet.create({

    container: {
        flex: 1,
        padding: 70,
        flexWrap: "wrap",
        maxHeight: 480,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
        paddingHorizontal: 100,
        borderRadius: 100,
        backgroundColor: "red"
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    button: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 100,
        backgroundColor: 'black',
    },
    box: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderRadius: 20
    },

});




