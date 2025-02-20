import * as SecureStore from 'expo-secure-store';

enum TokenStructure {
    TOKEN,
    REFRESH_TOKEN 
}


const TOKEN = 'TOKEN'
const REFRESH_TOKEN = 'REFRESH_TOKEN'

const storeApiKey = async (token: string, tokenType: TokenStructure): Promise<boolean> => {
  try {
    await SecureStore.setItem((tokenType == TokenStructure.TOKEN) ? TOKEN : REFRESH_TOKEN, token);
    console.log('Key-Value pair stored securely');
  } catch (error) {
    console.error('Error storing key-value pair:', error);
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
};

const getApiKey = async (tokenType: TokenStructure) => {
  try {
    const value = await SecureStore.getItem((tokenType == TokenStructure.TOKEN) ? TOKEN: REFRESH_TOKEN);
    if (value) {
      console.log('Retrieved value:', value);
      return value;
    } else {
      console.log('No value found for key:', TOKEN);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving key-value pair:', error);
    return null;
  }
};

const sessionCleaner = async () => {
    await Promise.all([SecureStore.deleteItemAsync(TOKEN), SecureStore.deleteItemAsync(REFRESH_TOKEN)])
    return true
}

export {storeApiKey, getApiKey, TokenStructure, sessionCleaner}