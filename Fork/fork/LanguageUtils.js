import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'LANGUAGETOKEN';

const translations = {
  en: {
    settings: 'Settings',
    general: 'General',
    allowPushNotifications: 'Allow Push Notifications',
    shareMyLocation: 'Share My Location',
    language: 'Language',
    logout: 'Logout',
    deleteAccount: 'Delete Account',
    reportAnIssue: 'Report an Issue',
    description: 'Description',
    reviewContent: 'Review Content',
    send: 'Send',
    filter: 'Filter',
    openFacilitiesOnly: 'Open Facilities Only',
    allFacilities: 'All Facilities',
    enterFacilityName: 'Enter facility name',
    cuisineType: 'CUISINE TYPE',
    dietaryPreference: 'DIETARY PREFERENCE',
    loadingFacilities: 'Loading facilities...',
    enterFacilityName: 'Enter facility name',
    cuisines: {
        Korean: 'Korean',
        Japanese: 'Japanese',
        Chinese: 'Chinese',
        Asian: 'Asian',
        Western: 'Western',
        Pizza: 'Pizza',
        Burger: 'Burger',
        Chicken: 'Chicken',
        Salad: 'Salad',
        Cafe: 'Cafe',
        Bar: 'Bar',
      },
      dietaryPreferences: {
        Vegetarian: 'Vegetarian',
        Vegan: 'Vegan',
        Pescatarian: 'Pescatarian',
        Halal: 'Halal',
        LactoseFree: 'Lactose-Free',
        GlutenFree: 'Gluten-Free',
      },
  },
  ko: {
    settings: '설정',
    general: '일반',
    allowPushNotifications: '푸시 알림 허용',
    shareMyLocation: '내 위치 공유',
    language: '언어',
    logout: '로그아웃',
    deleteAccount: '계정 삭제',
    reportAnIssue: '문제 신고',
    description: '설명',
    reviewContent: '내용 검토',
    send: '보내다',
    filter: '필터',
    openFacilitiesOnly: '영업 중인 시설만',
    allFacilities: '모든 시설',
    enterFacilityName: '시설 이름 입력',
    cuisineType: '요리 종류',
    dietaryPreference: '식이 요법',
    loadingFacilities: '시설 불러오는 중...',
    enterFacilityName: '시설 이름 입력',
    cuisines: {
        Korean: '한국 음식',
        Japanese: '일본 음식',
        Chinese: '중국 음식',
        Asian: '아시아 음식',
        Western: '서양 음식',
        Pizza: '피자',
        Burger: '버거',
        Chicken: '치킨',
        Salad: '샐러드',
        Cafe: '카페',
        Bar: '바',
      },
      dietaryPreferences: {
        Vegetarian: '채식주의자',
        Vegan: '비건',
        Pescatarian: '페스카테리언',
        Halal: '할랄',
        LactoseFree: '무유당',
        GlutenFree: '글루텐프리',
      },
  },
  // Add more languages here
};

export const setLanguageToken = async (language) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error setting language token:', error);
  }
};

export const getLanguageToken = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || 'en'; // Default to English if no language is set
  } catch (error) {
    console.error('Error getting language token:', error);
    return 'en'; // Default to English in case of error
  }
};

export const getTranslation = async (key) => {
  const language = await getLanguageToken();
  return translations[language][key] || translations['en'][key];
};

export const getAllTranslations = async () => {
  const language = await getLanguageToken();
  return translations[language] || translations['en'];
};
