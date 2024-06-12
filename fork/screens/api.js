import { useNavigation } from 'react-router-dom';
import FacilityDetail from './FacilityDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// const NODE_ENV = process.env.NODE_ENV || 'production';

// TEMPORARY CODE - change here for dev/prod switching
const NODE_ENV = 'production';

const suffix_map = {
  'development': 'dev',
  'production': 'prod',
  'test': 'test',
};

// This is the base-url that leads to all backend & S3
const API_ENDPOINT =
  `https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-dev`;

const BASE_URL =
  `${API_ENDPOINT}/${suffix_map[NODE_ENV]}/api`;

// Backend API endpoint
const FORK_URL = `${API_ENDPOINT}/${suffix_map[NODE_ENV]}/`;

// S3 endpoint
const S3_ENDPOINT = `${API_ENDPOINT}/s3`;
// Keys for AsyncStorage
const USER_TOKEN_KEY = 'USER_TOKEN';
const USER_ID_KEY = 'USER_ID';
const USER_PREFERENCE_KEY = 'USER_PREFERENCE';
const USER_TYPE_KEY = 'USER_TYPE';
const USER_REFRESH_TOKEN_KEY = 'USER_REFRESH_TOKEN';

export let USERBOOKMARKED = '';
export let USERTOKEN = 'guest';
export let USERREFRESHTOKEN = 'guest';
export let USERID = '';
export let USERPREFERENCE = [];
export let USERTYPE = '';

export let LOGIN = false;

export const changeLoginState = () => {
  LOGIN = true;
};

// --------------FETCH IMAGE-----------------

export const fetchImage = async (uri) => {
  const url = new URL(uri);
  const result = {
    Bucket: url.hostname,
    Key: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname,
  };
  const parsedKey = result.Key.replaceAll('/', '%2F');
  const requestFilePath = `${result.Bucket}/${parsedKey}`;
  const resultUrl = `${S3_ENDPOINT}/${requestFilePath}`;
  try {
    const response = await fetch(resultUrl, {
      method: 'GET',
      headers: {
        Accept: 'image/png',
      },
    });

    if (!response.ok) {
      const result = await response.json();
      console.log(result);
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
  }
};

// --------------HANDLE ERROR-----------------

const handleError = async (status) => {
  console.log('handling');

  if (status == 401) {
    console.log('refreshing token');
    try {
      const url = `${BASE_URL}/auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: USERTOKEN,
          Refresh: USERREFRESHTOKEN,
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log('Refereshing token successful :', jsonResponse);
        USERTOKEN = jsonResponse.data.token;
        await storeUserData(USER_TOKEN_KEY, USERTOKEN);

        console.log('USERTOKEN : ' + USERTOKEN);
        return true;
      } else {
        Alert.alert('Login Time Expired', 'Please Login Again');
        const jsonResponse = await response.text();
        console.log('Refresh token Failed: ', jsonResponse);
        await AsyncStorage.multiRemove([
          USER_TOKEN_KEY,
          USER_ID_KEY,
          USER_PREFERENCE_KEY,
          USER_TYPE_KEY,
          USER_REFRESH_TOKEN_KEY,
        ]);

        USERBOOKMARKED = '';
        USERTOKEN = 'guest';
        USERREFRESHTOKEN = 'guest';
        USERID = '';
        USERPREFERENCE = [];
        USERTYPE = '';
        LOGIN = false;
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  } else {
    console.log('other error');
    return false;
  }
};

// --------------STORAGE-----------------

// => Store user data in AsyncStorage
const storeUserData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

// => Retrieve user data from AsyncStorage
const retrieveUserData = async (key, defaultValue) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
  return defaultValue;
};
// --------------LOGIN-----------------

export const handleLogin = async (username, password) => {
  console.log(
    'in handleLogin : username => ' + username + ', password => ' + password
  );
  try {
    const url = `${FORK_URL}api/auth/login`;
    const requestBody = {
      userId: username,
      password: password,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'guest',
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status === 200) {
      const jsonResponse = await response.json();

      USERTOKEN = jsonResponse.data.token;
      console.log(jsonResponse.data);
      USERREFRESHTOKEN = jsonResponse.data.refreshToken;
      USERID = jsonResponse.data.user.id;
      USERPREFERENCE = await getUserPreferences(USERID);
      USERBOOKMARKED = await getUserFavorites(USERID);
      USERTYPE = jsonResponse.data.user.userType;

      await storeUserData(USER_TOKEN_KEY, USERTOKEN);
      await storeUserData(USER_ID_KEY, USERID);
      await storeUserData(USER_PREFERENCE_KEY, USERPREFERENCE);
      await storeUserData(USER_TYPE_KEY, USERTYPE);
      await storeUserData(USER_REFRESH_TOKEN_KEY, USERREFRESHTOKEN);

      console.log('USERID : ' + USERID);
      console.log('USERTOKEN : ' + USERTOKEN);
      console.log('USERREFRESHTOKEN : ' + USERREFRESHTOKEN);
      console.log(
        'USERPREFERENCE : ' + JSON.stringify(USERPREFERENCE, null, 2)
      );
      console.log(
        'USERBOOKMARKED : ' + JSON.stringify(USERBOOKMARKED, null, 2)
      );

      LOGIN = true;

      return true;
    } else {
      console.log(
        'Login Failed',
        'Invalid credentials or insufficient permissions.'
      );
      return false;
    }
  } catch (error) {
    console.log(error);
    USERTOKEN = 'guest';
    await storeUserData(USER_TOKEN_KEY, USERTOKEN);
    return false;
  }
};

export const handleLogOutMemory = async () => {
  await AsyncStorage.multiRemove([
    USER_TOKEN_KEY,
    USER_ID_KEY,
    USER_PREFERENCE_KEY,
    USER_TYPE_KEY,
    USER_REFRESH_TOKEN_KEY,
  ]);
  console.log('USERTOKEN: ', USERTOKEN);

  USERBOOKMARKED = '';
  USERTOKEN = 'guest';
  USERREFRESHTOKEN = 'guest';
  USERID = '';
  USERPREFERENCE = [];
  USERTYPE = '';
  LOGIN = false;
};

export const handleLogOut = async () => {
  console.log('USERTOKEN: ', USERTOKEN);

  await AsyncStorage.multiRemove([
    USER_TOKEN_KEY,
    USER_ID_KEY,
    USER_PREFERENCE_KEY,
    USER_TYPE_KEY,
    USER_REFRESH_TOKEN_KEY,
  ]);
  console.log('USERTOKEN: ', USERTOKEN);

  try {
    const url = `${BASE_URL}/auth/logout`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
    });

    if (response.status === 200) {
      const jsonResponse = await response.json();
      console.log('Logout successful :', jsonResponse);
      USERBOOKMARKED = '';
      USERTOKEN = 'guest';
      USERREFRESHTOKEN = 'guest';
      USERID = '';
      USERPREFERENCE = [];
      USERTYPE = '';
      LOGIN = false;
      return true;
    } else {
      if (await handleError(response.status)) {
        const final = await handleLogOut();
        return final;
      } else {
        const jsonResponse = await response.text();
        console.log('Logout Failed: ', jsonResponse);
        console.log('USERTOKEN:', USERTOKEN);
        throw new Error('Network response was not ok');
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Retrieve values from AsyncStorage on app start
export const initializeUserState = async () => {
  // USERTOKEN = 'guest';
  // USERID = '';
  // USERPREFERENCE =[];
  // USERTYPE = '';
  // USERREFRESHTOKEN = 'guest';
  // LOGIN = false;
  USERTOKEN = await retrieveUserData(USER_TOKEN_KEY, 'guest');
  if (USERTOKEN == 'guest') {
    console.log('logged out');
    LOGIN = false;
  } else {
    console.log('logged in');
    LOGIN = true;
  }
  USERID = await retrieveUserData(USER_ID_KEY, '');
  USERPREFERENCE = await retrieveUserData(USER_PREFERENCE_KEY, []);
  USERTYPE = await retrieveUserData(USER_TYPE_KEY, '');
  USERREFRESHTOKEN = await retrieveUserData(USER_REFRESH_TOKEN_KEY, 'guest');
};

export const deleteUser = async () => {
  try {
    const url = `${BASE_URL}/users/delete/${USERID}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
    });
    if (response.status === 200) {
      const jsonResponse = await response.json();
      console.log('Delete user successful :', jsonResponse);
      handleLogOutMemory();
      return true;
    } else {
      if (await handleError(response.status)) {
        const final = await deleteUser();
        return final;
      } else {
        const jsonResponse = await response.text();
        console.log('Delete User Failed: ', jsonResponse);
        throw new Error('Network response was not ok');
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const resetPassword = async (userId) => {
  const url = `${FORK_URL}api/auth/reset-password`;
  const payload = { userId };

  try {
    console.log('userId : ' + userId);
    console.log('responseBody JSON: ' + JSON.stringify(payload));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify(payload),
    });

    console.log('response status : ' + response.status);
    console.log('response : ' + JSON.stringify(response, null, 2));

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await resetPassword(userId);
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const registerUser = async (userId, password, userType, email) => {
  try {
    const url = `${FORK_URL}api/auth/register`;
    const requestBody = {
      userId,
      password,
      userType,
      email,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'guest',
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await registerUser(userId, password, userType, email);
        return final;
      } else {
        const errorResponse = await response.json();
        console.error('Error response from server:', errorResponse);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      console.log(
        'User registered successfully: ' + JSON.stringify(data, null, 2)
      );
      return data;
    }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const registerFacility = async (facilityData, images) => {
  console.log(facilityData);
  try {
    const url = `${FORK_URL}api/facilities/facility-requests`;
    const formData = new FormData();

    images.forEach((image) => {
      console.log('image type : ' + image.type);
      formData.append('images', {
        uri: image.uri.replace('file://', ''),
        name: image.uri.split('/').pop(),
        type: 'image/jpeg',
      });
    });

    formData.append('authorId', USERID);
    formData.append('title', facilityData.title);
    formData.append('content', JSON.stringify(facilityData.content));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: USERTOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await registerFacility(facilityData, images);
        return final;
      } else {
        const responseData = await response.json();
        console.log(responseData);
        throw new Error('Network response was not ok');
      }
    } else {
      const responseData = await response.json();
      console.log(
        'Facility registration request sent successfully:',
        responseData
      );
      return responseData;
    }
  } catch (error) {
    console.error('Error registering facility:', error);
    throw error;
  }
};

// --------------KAIST EMAIL-----------------

export const verifyEmail = async (userId, code) => {
  try {
    const url = `${FORK_URL}api/auth/verify-kaist`;
    const requestBody = {
      userId,
      code,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'guest',
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await verifyEmail(userId, code);
        return final;
      } else {
        const errorResponse = await response.json();
        console.error('Error response from server :', errorResponse);
        //throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      console.log(
        'Email verified successfully : ' + JSON.stringify(data, null, 2)
      );
      return data;
    }
  } catch (error) {
    console.error('Error verifying email :', error);
    //throw error;
  }
};

export const resendVerifyEmail = async (userId) => {
  try {
    const url = `${FORK_URL}api/auth/resend-verification-mail`;
    const requestBody = {
      userId,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'guest',
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await resendVerifyEmail(userId);
        return final;
      } else {
        const errorResponse = await response.json();
        console.error('Error response from server :', errorResponse);
        //throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      console.log(
        'Email resent successfully : ' + JSON.stringify(data, null, 2)
      );
      return data;
    }
  } catch (error) {
    console.error('Error resending email :', error);
    //throw error;
  }
};

// --------------DEFAULT FILTERS-----------------

export const addUserPreference = async (userId, preferenceId) => {
  try {
    const url = `${FORK_URL}api/users/preference/${userId}`;
    const requestBody = { preferenceId };
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await addUserPreference(userId, preferenceId);
        return final;
      } else {
        const errorResponse = await response.json();
        console.error(
          'Error response from server in addUserPreference:',
          errorResponse
        );
        throw new Error(
          errorResponse.message ||
            'Network response in addUserPreference was not ok'
        );
      }
    } else {
      const data = await response.json();
      console.log(
        'Preference added successfully:',
        JSON.stringify(data, null, 2)
      );
      return data;
    }
  } catch (error) {
    console.error('Error adding user preference:', error);
    throw error;
  }
};

export const getAllUsders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getAllUsders();
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json(); // Parse the JSON from the response
      return data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// --------------FACILITIES IN MAP-----------------

export const fetchFacilityWithName = async (
  facilityName,
  openNow = false,
  preferences = []
) => {
  try {
    let url = `${FORK_URL}api/map/search?name=${encodeURIComponent(facilityName)}`;

    if (openNow) {
      url += `&openNow=${openNow}`;
    }

    if (preferences.length > 0) {
      url += `&preferences=${preferences.join(',')}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: USERTOKEN,
      },
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await fetchFacilityWithName(
          facilityName,
          openNow,
          preferences
        );
        return final;
      } else {
        throw new Error('Network response was not ok in real fetchMethod');
      }
    } else {
      const jsonResponse = await response.json();
      //console.log("fetchFaciliyWithName facility data json response " + JSON.stringify(jsonResponse, null, 2))
      const facilityData = jsonResponse.data;
      //console.log("fetchFaciliyWithName facility data " +  JSON.stringify(facilityData, null, 2))
      return facilityData;
    }
  } catch (error) {
    console.error('Error fetching facilities in real fetchMethod:', error);
    throw error;
  }
};

////No error handling
export const fetchFacilitiesInBounds = async (
  northEastLat,
  northEastLng,
  southWestLat,
  southWestLng,
  favorite
) => {
  //console.log( "USERID : " + USERID );
  //console.log( "USERPREFERENCE : " + JSON.stringify(USERPREFERENCE, null, 2));
  try {
    const latMin = Math.min(northEastLat, southWestLat);
    const latMax = Math.max(northEastLat, southWestLat);
    const lngMin = Math.min(northEastLng, southWestLng);
    const lngMax = Math.max(northEastLng, southWestLng);
    const url = favorite
      ? `${FORK_URL}api/map/search?latMin=${encodeURIComponent(latMin)}&lngMin=${encodeURIComponent(lngMin)}&latMax=${encodeURIComponent(latMax)}&lngMax=${encodeURIComponent(lngMax)}&favorite=true`
      : `${FORK_URL}api/map/search?latMin=${encodeURIComponent(latMin)}&lngMin=${encodeURIComponent(lngMin)}&latMax=${encodeURIComponent(latMax)}&lngMax=${encodeURIComponent(lngMax)}`;

    if (favorite) {
      //console.log("UserBookmarkedActive");
      //console.log("url : " + url);
    } else {
      //console.log("UserBookmarkedNotActive");
      //console.log("url : " + url);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: USERTOKEN,
      },
    });
    //console.log("Response object:", response);
    //console.log("Status:", response.status);

    const jsonResponse = await response.json();

    const facilitiesData = jsonResponse.data;
    if (favorite) {
      //console.log("Facilities data in favorite :", JSON.stringify(facilitiesData, null, 2));
    } else {
      //console.log("Facilities data in not favorite :");
    }

    return facilitiesData;
  } catch (error) {
    console.error('Error fetching facilities in real fetchMethod:', error);
    throw error;
  }
};

export const getParsedUserPreferences = () => {
  console.log(
    'here and USERPREFERENCE:',
    JSON.stringify(USERPREFERENCE, null, 2)
  );
  if (USERPREFERENCE && Array.isArray(USERPREFERENCE)) {
    console.log('Parsing preferences by IDs');
    return USERPREFERENCE.map((pref) => pref.id);
  }
  return [];
};

// --------------USER-----------------

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getAllUsers();
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json(); // Parse the JSON from the response
      return data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getUserByID = async (userID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(userID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getUserByID(userID);
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching use in getUserById:', error);
    throw error;
  }
};

export const getUserPreferences = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/preference/${encodeURIComponent(USERID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getUserPreferences();
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user in getUserPreferences:', error);
    throw error;
  }
};

export const getUserFavorites = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getUserFavorites();
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const isFacilityBookmarked = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}/has/${encodeURIComponent(facilityID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await isFacilityBookmarked(facilityID);
        return final;
      } else {
        throw new Error('Network response was not ok got checking bookmarked');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching stamp rule:', error);
    throw error;
  }
};

export const addFavorite = async (facilityId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({ facilityId: encodeURIComponent(facilityId) }),
      }
    );

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await addFavorite(facilityId);
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const deleteFavorite = async (facilityId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({ facilityId: encodeURIComponent(facilityId) }),
      }
    );

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await deleteFavorite(facilityId);
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const getFavoritesNotices = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}/updates`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFavoritesNotices();
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getMyFacilities = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(USERID)}/myfacility`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getMyFacilities();
        return final;
      } else {
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user in getUserPreferences:', error);
    throw error;
  }
};

export const addUserPreference2 = async (preferenceId) => {
  try {
    console.log(preferenceId);
    const response = await fetch(
      `${BASE_URL}/users/preference/${encodeURIComponent(USERID)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({ preferenceId }),
      }
    );
    const data = await response.json();
    USERPREFERENCE = await getUserPreferences(USERID);
    if (response.status === 201) {
      console.log('Preference added successfully:', data);
    } else {
      console.error('Failed to add preference:', data);
    }
  } catch (error) {
    console.error('Error adding preference:', error);
  }
};

export const deleteUserPreference = async (preferenceId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/preference/${encodeURIComponent(USERID)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({ preferenceId }),
      }
    );
    const data = await response.json();
    USERPREFERENCE = await getUserPreferences(USERID);
    if (response.status === 200) {
      console.log('Preference removed successfully:', data);
    } else {
      console.error('Failed to remove preference:', data);
    }
  } catch (error) {
    console.error('Error removing preference:', error);
  }
};

export const updateUserProfile = async ({ email, password }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/profile/${encodeURIComponent(USERID)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (response.status === 201) {
      console.log('Profile updated successfully:', data);
    } else {
      console.error('Failed to update profile:', data);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

export const uploadUserProfileImage = async (imageUri) => {
  try {
    const formData = new FormData();

    if (imageUri) {
      formData.append('image', {
        uri: imageUri.replace('file://', ''),
        name: imageUri.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await fetch(
      `${BASE_URL}/users/profile/image/${encodeURIComponent(USERID)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: USERTOKEN,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await uploadUserProfileImage(imageUri);
        return final;
      } else {
        const errorData = await response.text();
        throw new Error(`Error: ${errorData}`);
      }
    } else {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error('Error creating facility post:', error.Error);
    throw error;
  }
};

export const deleteFacility = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(USERID)}/myfacility/${encodeURIComponent(facilityID)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await deleteFacility(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};

// --------------FACILITY-----------------

export const getFacilityByID = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityByID(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getFacilityStampRuleByID = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/stamp-ruleset`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityStampRuleByID(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching stamp rule:', error);
    throw error;
  }
};

export const getFacilityPreferences = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/preferences`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityPreferences(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching stamp rule:', error);
    throw error;
  }
};

export const getFacilityMenu = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/menu`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityMenu(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching stamp rule:', error);
    throw error;
  }
};

export const getFacilityOpeningHour = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/opening-hours`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityOpeningHour(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching stamp rule:', error);
    throw error;
  }
};

export const getTrendingFacilities = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/leaderboard/trending?limit=${encodeURIComponent(5)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        console.log('handled');
        const final = await getTrendingFacilities();
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching trending facilities:', error);
    throw error;
  }
};

export const getNewestFacilities = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/leaderboard/newest?limit=${encodeURIComponent(5)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getNewestFacilities();
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching newest facilities:', error);
    throw error;
  }
};

export const getTrendingPreferenceFacilities = async (preference) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/leaderboard/trending?limit=${encodeURIComponent(1)}&preferences=${encodeURIComponent(preference)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getTrendingPreferenceFacilities(preference);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching trending facilities:', error);
    throw error;
  }
};

export const getFacilityNotices = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/post`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityNotices(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createFacilityPost = async ({ facilityId, content, imageUri }) => {
  try {
    const formData = new FormData();

    formData.append('authorId', USERID);
    formData.append('title', '');
    formData.append('content', content);

    if (imageUri) {
      formData.append('image', {
        uri: imageUri.replace('file://', ''),
        name: imageUri.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await fetch(`${BASE_URL}/facilities/${facilityId}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: USERTOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await createFacilityPost({
          facilityId: facilityId,
          content: content,
          imageUri: imageUri,
        });
        return final;
      } else {
        const errorData = await response.text();
        console.log(`Error: ${errorData}`);
        throw response.status;
      }
    } else {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error('Error creating facility post:', error);
    throw error;
  }
};

export const editFacility = async ({ facilityID, facilityData }) => {
  try {
    const url = `${BASE_URL}/users/${USERID}/myfacility/${facilityID}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify(facilityData),
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await editFacility({
          facilityID: facilityID,
          facilityData: facilityData,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const responseData = await response.json();
      console.log('Facility edit request sent successfully:', responseData);
      return responseData;
    }
  } catch (error) {
    console.error('Error registering facility:', error);
    throw error;
  }
};

export const uploadMenuImage = async ({ facilityId, menuId, imageUri }) => {
  console.log('uploading menu images: ', facilityId, menuId, imageUri);
  try {
    const url = `${BASE_URL}/facilities/${facilityId}/menu/${menuId}/image`;
    const formData = new FormData();

    const imageFile = {
      uri: imageUri,
      name: imageUri.split('/').pop(),
      type: 'image/jpeg', // or the appropriate MIME type for your image
    };

    formData.append('image', imageFile);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: USERTOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await uploadMenuImage({
          facilityId: facilityId,
          menuId: menuId,
          imageUri: imageUri,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok');
      }
    } else {
      const responseData = await response.json();
      console.log('Menu image uploaded successfully:', responseData);
      return responseData;
    }
  } catch (error) {
    console.error('Error uploading menu image:', error);
    throw error;
  }
};

export const updateFacilityMenu = async ({ facilityID, menuID, menuData }) => {
  try {
    const url = `${BASE_URL}/facilities/${facilityID}/menu/${menuID}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify(menuData),
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await updateFacilityMenu({
          facilityID: facilityID,
          menuID: menuID,
          menuData: menuData,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const responseData = await response.json();
      console.log('Facility edit request sent successfully:', responseData);
      return responseData;
    }
  } catch (error) {
    console.error('Error registering facility:', error);
    throw error;
  }
};

export const createFacilityMenu = async ({ facilityID, menuData }) => {
  try {
    const url = `${BASE_URL}/facilities/${facilityID}/menu`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify(menuData),
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await createFacilityMenu({
          facilityID: facilityID,
          menuData: menuData,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const responseData = await response.json();
      console.log('Facility edit request sent successfully:', responseData);
      return responseData.data;
    }
  } catch (error) {
    console.error('Error registering facility:', error);
    throw error;
  }
};

export const uploadStampLogo = async ({ facilityID, imageUri }) => {
  try {
    const url = `${BASE_URL}/facilities/${facilityID}/stamp-ruleset/logo`;
    console.log('variables', facilityID, imageUri);
    const formData = new FormData();

    if (imageUri) {
      formData.append('image', {
        uri: imageUri.replace('file://', ''),
        name: imageUri.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: USERTOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await uploadStampLogo({
          facilityID: facilityID,
          imageUri: imageUri,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const responseData = await response.json();
      console.log('Facility edit request sent successfully:', responseData);
      return responseData.data;
    }
  } catch (error) {
    console.error('Error registering facility:', error);
    throw error;
  }
};

export const uploadFacilityProfile = async ({ facilityID, imageUri }) => {
  try {
    const url = `${BASE_URL}/facilities/${facilityID}/profile/image`;
    console.log('variables', facilityID, imageUri);
    const formData = new FormData();

    if (imageUri) {
      formData.append('image', {
        uri: imageUri.replace('file://', ''),
        name: imageUri.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: USERTOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await uploadFacilityProfile({
          facilityID: facilityID,
          imageUri: imageUri,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const responseData = await response.json();
      console.log('Facility edit request sent successfully:', responseData);
      return responseData.data;
    }
  } catch (error) {
    console.error('Error registering facility:', error);
    throw error;
  }
};

export const deletePost = async ({ facilityID, postID }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/post/${encodeURIComponent(postID)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await deletePost({
          facilityID: facilityID,
          postID: postID,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// --------------REVIEW-----------------

export const getReviewByQuery = async (
  userID,
  facilityId,
  hasImage,
  hashtags
) => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();

    // Conditionally append parameters if they are not null
    if (facilityId)
      queryParams.append('facility', encodeURIComponent(facilityId));
    if (userID) queryParams.append('user', encodeURIComponent(userID));
    if (hasImage) queryParams.append('hasImage', encodeURIComponent(hasImage));
    if (hashtags) queryParams.append('hashtags', encodeURIComponent(hashtags));
    const queryString = queryParams.toString();

    const url = `${BASE_URL}/reviews?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getReviewByQuery(
          userID,
          facilityId,
          hasImage,
          hashtags
        );
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

export const getTopHashtags = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/hashtags/top/${encodeURIComponent(facilityID)}?limit=${encodeURIComponent(5)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getTopHashtags(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility stamp:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/reviews/${encodeURIComponent(reviewId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await deleteReview(reviewId);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility stamp:', error);
    throw error;
  }
};

export const createReview = async ({
  facilityId,
  score,
  content,
  hashtags,
  imageUri,
}) => {
  try {
    const formData = new FormData();

    formData.append('authorId', USERID);
    formData.append('facilityId', facilityId);
    formData.append('score', score);
    formData.append('content', content);
    formData.append('hashtags', JSON.stringify(hashtags));

    if (imageUri) {
      formData.append('image', {
        uri: imageUri.replace('file://', ''),
        name: imageUri.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await fetch(`${BASE_URL}/reviews/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: USERTOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await createReview({
          facilityId: facilityId,
          score: score,
          content: content,
          hashtags: hashtags,
          imageUri: imageUri,
        });
        return final;
      } else {
        // Log the full response for debugging
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw response.status;
      }
    } else {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error('Error uploading review:', error);
    throw error;
  }
};

export const editReview = async ({ reviewId, content, hashtags }) => {
  try {
    const requestBody = {
      content: content,
      hashtags: hashtags,
    };

    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await editReview({
          reviewId: reviewId,
          content: content,
          hashtags: hashtags,
        });
        return final;
      } else {
        const errorData = await response.text();
        console.log(`Error: ${errorData}`);
        throw response.status;
      }
    } else {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error('Error uploading review:', error);
    throw error;
  }
};

// --------------STAMP-----------------

export const getFacilityStamp = async (facilityID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/stamps?user=${encodeURIComponent(USERID)}&facility=${encodeURIComponent(facilityID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityStamp(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility stamp:', error);
    throw error;
  }
};

export const getStampBook = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/stamps?user=${encodeURIComponent(USERID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getStampBook();
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility stamp:', error);
    throw error;
  }
};

export const sendStampTransaction = async (
  userID,
  facilityID,
  type,
  amount
) => {
  try {
    console.log(userID, facilityID, type, amount);
    const response = await fetch(`${BASE_URL}/stamps/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify({
        buyerId: userID,
        facilityId: facilityID,
        sellerId: USERID,
        type: type,
        amount: amount,
      }),
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await sendStampTransaction(
          userID,
          facilityID,
          type,
          amount
        );
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error sending stamp transaction:', error);
    throw error;
  }
};

export const deleteFacilityMenu = async ({ facilityID, menuID }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/menu/${encodeURIComponent(menuID)}?limit=${encodeURIComponent(5)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await deleteFacilityMenu({
          facilityID: facilityID,
          menuID: menuID,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error deleting facility menu:', error);
    throw error;
  }
};

export const getSummaryReview = async (facilityID) => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/summary/${facilityID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
    });
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getSummaryReview(facilityID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility registrations:', error);
    throw error;
  }
};

// --------------ADMIN-----------------

export const getFacilityRegistrations = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/facility-requests?status=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getFacilityRegistrations();
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility registrations:', error);
    throw error;
  }
};

export const getMyFacilityRegistrations = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/facility-requests?status=0&user=${encodeURIComponent(USERID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getMyFacilityRegistrations();
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility registrations:', error);
    throw error;
  }
};

export const acceptFacilityRegistrations = async (requestID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/facility-requests/${encodeURIComponent(requestID)}/accept`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({
          adminId: USERID,
        }),
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await acceptFacilityRegistrations(requestID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error accepting facility registrations:', error);
    throw error;
  }
};

export const declineFacilityRegistrations = async (requestID) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/facility-requests/${encodeURIComponent(requestID)}/decline`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
        body: JSON.stringify({
          adminId: USERID,
        }),
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await declineFacilityRegistrations(requestID);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error declining facility registrations:', error);
    throw error;
  }
};

export const getReports = async (type) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/reports?type=${encodeURIComponent(type)}&status=${encodeURIComponent(0)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await getReports(type);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching facility registrations:', error);
    throw error;
  }
};

export const sendReviewReport = async ({ content, reviewId }) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/reports/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify({
        authorId: USERID,
        type: 1,
        content: content,
        reviewId: reviewId,
      }),
    });
    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await sendReviewReport({
          content: content,
          reviewId: reviewId,
        });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error sending review report:', error);
    throw error;
  }
};

export const sendBugReport = async ({ content }) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/reports/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: USERTOKEN,
      },
      body: JSON.stringify({
        authorId: USERID,
        type: 0,
        content: content,
      }),
    });
    const result = await response.json();
    console.log(content);
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await sendBugReport({ content: content });
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error sending bug report:', error);
    throw error;
  }
};

export const deleteReport = async (reportId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/reports/delete/${encodeURIComponent(reportId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: USERTOKEN,
        },
      }
    );
    if (!response.ok) {
      if (await handleError(response.status)) {
        const final = await deleteReport(reportId);
        return final;
      } else {
        const result = await response.text();
        console.log(result);
        throw new Error('Network response was not ok', result);
      }
    } else {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
