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
    pref: {
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
        Vegetarian: 'Vegetarian',
        Vegan: 'Vegan',
        Pescatarian: 'Pescatarian',
        Halal: 'Halal',
        LactoseFree: 'Lactose-Free',
        GlutenFree: 'Gluten-Free',
      },

      trending: 'Trending',
      new: 'New',
      foodiePicks: 'Foodie picks',
      forOur: 'For our',
      dishLovers: 'Dish lovers',
      weSuggest: 'we suggest ...',

      favorites: 'Favorites',
      noNotices: 'No notices available',

      myPage: 'My Page',
      edit: 'Edit',
      myStamps: 'My Stamps',
      myReviews: 'My Reviews',
      registrationRequest: 'Registration Request',
      selectFacility: 'Select facility',
      facility: 'Facility',
      search: 'Search...',
      uploadNotice: 'Upload Notice',
      noticeImage: 'Notice Image',
      description: 'Description',
      reviewReports: 'Review Reports',
      facilityRegistration: 'Facility Registration',
      bugReports: 'Bug Reports',
      notice: 'Notice',

      signUp: 'Sign Up',
      logIn: 'Log In',
      startWithoutAccount: 'Start without an account',

      logIn: 'Log In',
      username: 'Username',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      logInFailed: 'Login failed. Please check your username and password.',

      resetPassword: 'Reset your password',
      enterUsername: 'Please enter your username below to reset your password.',
      confirm: 'Confirm',
      resetPasswordFailed: 'Failed to reset password',
      resetPasswordError: 'An error occurred while resetting the password',

      whichUserAreYou: 'Which User Are You?',
      facilityOwner: 'Facility owner',
      kaistMember: 'KAIST member',

      email: 'Email',
      confirmPassword: 'Confirm Password',
      error: 'Error',
      passwordsDoNotMatch: 'Passwords do not match',

      verifyEmailTitle: 'Verify your KAIST email',
      verificationCodePrompt: 'We sent a verification code to your email address. Please check your email inbox.',
      verificationCodePlaceholder: 'Verification code',
      resendCode: 'Resend code',
      successfulRegistrationTitle: 'You successfully registered on FORK!',
      start: 'Start',
      wrongVerificationCode: 'Wrong Verification Code',
      tryAgainWithCorrectCode: 'Try again with the correct verification code',

      myFacility: 'MY FACILITY',
      name: 'Name',
      serviceDescription: 'Service Description',
      websiteURL: 'Website URL',
      phoneNumber: 'Phone Number',
      businessRegistrationNumber: 'Business Registration Number',
      roadAddress: 'Road Address',
      englishAddress: 'English Address',
      postNumber: 'Post Number',
      city: 'City',
      country: 'Country',
      cuisineTypes: 'CUISINE TYPES',
      dietaryPreferences: 'DIETARY PREFERENCES',
      openingHours: 'OPENING HOURS',
      menu: 'MENU',
      menuItem: 'Add Menu Item',
      stamps: 'STAMPS',
      rewardName: 'Reward Name',
      numberOfStampsRequired: 'Number of Stamps Required',
      reward: 'Add Reward',
      confirm: 'Confirm',
      failedRegistration: 'Error',
      failedRegistrationMessage: 'Failed to send facility registration request. Please try again.',
      menuItemName: 'Menu Item Name',
      rewardName: 'Reward Name',
      quantity: 'Quantity',
      price: 'Price',
      openTimePlaceholder: 'Open Time (e.g., 17:00, Closed)',
      closeTimePlaceholder: 'Close Time (e.g., 09:00, Closed)',
      allowNotif: 'Allow push notifications',
      permissionNotif: 'Would you like to enable push notifications to be notified once your registration request is accepted?',
      yes: 'Yes',
      no: 'No',

      registerReq: 'Registration request sent',
      reqText: 'Once FORK admin reviews your registration request, a notification will be sent by both FORK application and email.',

      foodPreferences: 'Your Food Prefences',
      save: 'Save',
      editProfil: 'Edit Profile',
      menuSmall: 'Menu',
      review: 'Review',
      notice: 'Notice',
      stampsNot: 'Stamps Not Created',
      addHashtag: 'Add Hashtag',
      hashtags: 'Hashtags',
      writeReviews: 'Write Reviews',
      loadingReviews: 'Loading reviews...',
      summary: 'Clean, kind and tasty',
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
    facility: '시설',
    enterFacilityName: '시설 이름 입력',
    cuisineType: '요리 종류',
    dietaryPreference: '식이 요법',
    loadingFacilities: '시설 불러오는 중...',
    enterFacilityName: '시설 이름 입력',
    pref: {
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
        Vegetarian: '채식주의자',
        Vegan: '비건',
        Pescatarian: '페스카테리언',
        Halal: '할랄',
        LactoseFree: '무유당',
        GlutenFree: '글루텐프리',
      },

      trending: '인기',
      new: '새로운',
      foodiePicks: '음식 선택',
      forOur: '우리',
      dishLovers: '요리 애호가들을 위한',
      weSuggest: '저희가 추천합니다 ...',

      favorites: '즐겨찾기',
      noNotices: '공지 사항 없음',

      myPage: '내 페이지',
      edit: '편집',
      myStamps: '내 도장',
      myReviews: '내 리뷰',
      registrationRequest: '등록 요청',
      selectFacility: '시설 선택',
      search: '검색...',
      uploadNotice: '공지 업로드',
      noticeImage: '공지 이미지',
      description: '설명',
      reviewReports: '리뷰 보고서',
      facilityRegistration: '시설 등록',
      bugReports: '버그 보고서',
      notice: '공지',

      signUp: '가입하기',
      logIn: '로그인',
      startWithoutAccount: '계정 없이 시작하기',

      logIn: '로그인',
      username: '사용자 이름',
      password: '비밀번호',
      forgotPassword: '비밀번호를 잊으셨나요?',
      logInFailed: '로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인하세요.',

      resetPassword: '비밀번호 재설정',
      enterUsername: '비밀번호를 재설정하려면 아래에 사용자 이름을 입력하십시오.',
      confirm: '확인',
      resetPasswordFailed: '비밀번호 재설정 실패',
      resetPasswordError: '비밀번호 재설정 중 오류가 발생했습니다',

      whichUserAreYou: '어떤 사용자이십니까?',
      facilityOwner: '시설 소유자',
      kaistMember: 'KAIST 회원',


      email: '이메일',
      confirmPassword: '비밀번호 확인',
      error: '오류',
      passwordsDoNotMatch: '비밀번호가 일치하지 않습니다',

      verifyEmailTitle: 'KAIST 이메일을 확인하세요',
      verificationCodePrompt: '귀하의 이메일 주소로 인증 코드를 보냈습니다. 이메일 받은 편지함을 확인하세요.',
      verificationCodePlaceholder: '인증 코드',
      resendCode: '코드 재전송',
      successfulRegistrationTitle: 'FORK에 성공적으로 등록되었습니다!',
      start: '시작',
      wrongVerificationCode: '잘못된 인증 코드',
      tryAgainWithCorrectCode: '올바른 인증 코드로 다시 시도하세요',

      myFacility: '내 시설',
      name: '이름',
      serviceDescription: '서비스 설명',
      websiteURL: '웹사이트 URL',
      phoneNumber: '전화번호',
      businessRegistrationNumber: '사업자 등록 번호',
      roadAddress: '도로명 주소',
      englishAddress: '영문 주소',
      postNumber: '우편 번호',
      city: '도시',
      country: '국가',
      cuisineTypes: '음식 종류',
      dietaryPreferences: '식이 요법',
      openingHours: '영업 시간',
      menu: '메뉴',
      menuItem: '메뉴 항목 추가',
      stamps: '도장',
      rewardName: '보상 이름',
      numberOfStampsRequired: '필요한 도장 수',
      reward: '보상 추가',
      confirm: '확인',
      failedRegistration: '오류',
      failedRegistrationMessage: '시설 등록 요청을 보내지 못했습니다. 다시 시도해 주세요.',  
      menuItemName: '메뉴 항목 이름',
      rewardName: '보상 이름',
      quantity: '수량',
      price: '가격',
      openTimePlaceholder: '개장 시간 (예: 9:00, 휴무)',
      closeTimePlaceholder: '마감 시간 (예: 17:00, 휴무)',
      allowNotif: '푸시 알림 허용',
      permissionNotif: '등록 요청이 승인되면 알림을 받기 위해 푸시 알림을 활성화하시겠습니까?',
      yes: '예',
      no: '아니오',

      registerReq: '등록 요청이 전송되었습니다',
      reqText: 'FORK 관리자가 귀하의 등록 요청을 검토하면, FORK 애플리케이션과 이메일로 알림이 전송됩니다.',

      foodPreferences: '귀하의 음식 선호도',
      save: '저장',
      editProfil: '프로필 편집',
      menuSmall: '메뉴',
      review: '리뷰',
      notice: '공지',
      stampsNot: '도장이 생성되지 않았습니다',
      addHashtag: '해시태그 추가',
      hashtags: '해시태그',
      writeReviews: '리뷰 작성',
      loadingReviews: '리뷰를 불러오는 중...',
      summary: '깨끗하고 친절하며 맛있다',
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
