import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentSession = async () => {
  return await AsyncStorage.getItem("sessionToken");
}