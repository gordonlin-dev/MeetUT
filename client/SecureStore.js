import * as SecureStore from 'expo-secure-store';

exports.Save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
};

exports.GetValue = async (key) => {
    return await SecureStore.getItemAsync(key);
}

exports.Delete = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
        let result = await SecureStore.getItemAsync(key);
        console.log(result)
    } catch (error) {
        console.log(error);
    }
}
