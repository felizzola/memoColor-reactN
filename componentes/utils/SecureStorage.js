import * as SecureStore from 'expo-secure-store';

const Storage = {};

Storage.save = async (key, value) => {
    try {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        await SecureStore.setItemAsync(key, value)
    } catch (error) {
        console.log("Error al Guardar",error)
    }
}

Storage.getValueFor = async (key) => {
    try {
        const result = await SecureStore.getItemAsync(key);
        return JSON.parse(result)

    } catch (error) {
        return null
    }
}

Storage.borrar = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {

    }

}

export default Storage;