import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentSession = async () => {
  const sessionToken = await AsyncStorage.getItem("sessionToken");
  return sessionToken;
}