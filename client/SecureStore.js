import * as SecureStore from 'expo-secure-store';

exports.Save = async (key, value) =>{
    await SecureStore.setItemAsync(key, value);
};

exports.GetValue = async (key) => {
    let result = await SecureStore.getItemAsync(key);
    return result;
}

exports.Delete = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.log(error);
    }
    
}