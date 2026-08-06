import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@antgravity:auth_token',
  USER_DATA: '@antgravity:user_data',
  API_KEYS: '@antgravity:api_keys',
  SETTINGS: '@antgravity:settings',
};

export const storage = {
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.error('Erro ao salvar token no storage:', e);
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error('Erro ao obter token do storage:', e);
      return null;
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error('Erro ao remover token do storage:', e);
    }
  },

  async saveApiKeys(keys) {
    try {
      await AsyncStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
    } catch (e) {
      console.error('Erro ao salvar chaves no storage:', e);
    }
  },

  async getApiKeys() {
    try {
      const data = await AsyncStorage.getItem(KEYS.API_KEYS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Erro ao obter chaves do storage:', e);
      return {};
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
    }
  },

  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Erro ao obter configurações:', e);
      return {};
    }
  },
};
