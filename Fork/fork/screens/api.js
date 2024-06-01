const BASE_URL = 'https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-dev/dev/api';

// This is the base-url that leads to all backend & S3
const API_ENDPOINT = "https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-dev";

// Backend API endpoint
const FORK_URL = `${API_ENDPOINT}/dev/`
// "API_PATH": "api/users" or any other method routes

// S3 endpoint
const S3_ENDPOINT = `${API_ENDPOINT}/s3`

// export let USERTOKEN = "";
// export let USERID = "";
// export let USERPREFERENCE = "";


export let USERTOKEN = "kaist";
export let USERID = 1;
export let USERPREFERENCE = [];

// --------------REGISTER-----------------

export const resetPassword = async (userId) => {
    const url = `${FORK_URL}api/auth/reset-password`;
    const payload = { userId };
    
    try {
        console.log("userId : " + userId);
        console.log("responseBody JSON: " + JSON.stringify(payload));
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'foodie' 
            },
            body: JSON.stringify(payload),
        });

        console.log("response status : " + response.status);
        console.log("response : " +  JSON.stringify(response, null, 2));


        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
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
            email
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'foodie' 
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error response from server:', errorResponse);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("User registered successfully: " + JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// export const registerFacility = async (facilityData) => {
//     try {
//       const url = `${FORK_URL}api/facilities/facility-requests`;
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'foodie'
//         },
//         body: JSON.stringify(facilityData)
//       });
  
//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error('Error response from server in registerFacility:', errorResponse);
//         throw new Error(errorResponse.message || 'Network response was not ok in registerFacility');
//       }
  
//       const data = await response.json();
//       console.log("Facility registration request sent successfully:", JSON.stringify(data, null, 2));
//       return data;
//     } catch (error) {
//       console.error('Error sending facility registration request:', error);
//       throw error;
//     }
// };

export const registerFacility = async (facilityData, images) => {
    try {
        const url = `${FORK_URL}api/facilities/facility-requests`;
        const formData = new FormData();

        // Create a new array for the image data
        const imageArray = images.map((image, index) => ({
            uri: image.uri,
            name: `image_${index}.jpg`,
            type: 'image/jpeg'
        }));

        // Append the array as a JSON string
        formData.append('images', JSON.stringify(imageArray));
        formData.append('authorId', facilityData.authorId);
        formData.append('title', facilityData.title);
        formData.append('content', JSON.stringify(facilityData.content));

        console.log("formData : "+ JSON.stringify(formData, null, 2));
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'foodie' // Do not set 'Content-Type' header for multipart/form-data
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        //console.log('Facility registration request sent successfully:', responseData);
        return responseData;
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
            code
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'foodie' 
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error response from server :', errorResponse);
            //throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Email verified successfully : " + JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        //console.error('Error verifying email :', error);
        //throw error;
    }
};

export const resendVerifyEmail = async (userId) => {
    try {
        const url = `${FORK_URL}api/auth/resend-verification-mail`;
        const requestBody = {
            userId
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'foodie' 
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error response from server :', errorResponse);
            //throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Email resent successfully : " + JSON.stringify(data, null, 2));
        return data;
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
          'Authorization': 'foodie'
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response from server in addUserPreference:', errorResponse);
        throw new Error(errorResponse.message || 'Network response in addUserPreference was not ok');
      }
      const data = await response.json();
      console.log("Preference added successfully:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Error adding user preference:', error);
      throw error;
    }
  };
  

export const fetchImage = async (uri) => {
    const url = new URL(uri);
    const result = {
        Bucket: url.hostname,
        Key: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
    }
    const parsedKey = result.Key.replaceAll("/", "%2F");
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
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log("fetched", imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}
// --------------LOGIN----------------- 

export const handleLogin = async (username, password) => {
    console.log('in handleLogin : username => ' + username + ', password => ' + password);
    try {
      const url = `${FORK_URL}api/auth/login`;
      const requestBody = {
        userId: username,
        password: password
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'foodie'
        },
        body: JSON.stringify(requestBody)
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        USERTOKEN = jsonResponse.data.token;
        USERID = jsonResponse.data.user.id;
        USERPREFERENCE = await getUserPreferences();
        console.log("USERID : " + USERID);
        console.log("USERPREFERENCE : " + JSON.stringify(USERPREFERENCE, null, 2));
        return true;
      } else {
        console.log('Login Failed', 'Invalid credentials or insufficient permissions.');
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
};

export const getAllUsders = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse the JSON from the response
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// --------------FACILITIES IN MAP-----------------

export const fetchFacilityWithName = async (facilityName, openNow = false, preferences = []) => {
    try {
        let url = `${FORK_URL}api/map/search?name=${encodeURIComponent(facilityName)}`;

        if (openNow) {
            url += `&openNow=${openNow}`;
        }

        if (preferences.length > 0) {
            url += `&preferences=${preferences.join(',')}`;
        }
        //console.log("fetchFaciliyWithName " + url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'foodie',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok in real fetchMethod');
        }

        const jsonResponse = await response.json();
        //console.log("fetchFaciliyWithName facility data json response " + JSON.stringify(jsonResponse, null, 2))
        const facilityData = jsonResponse.data;
        //console.log("fetchFaciliyWithName facility data " +  JSON.stringify(facilityData, null, 2))
        return facilityData;
    } catch (error) {
        console.error('Error fetching facilities in real fetchMethod:', error);
        throw error;
    }
};

export const fetchFacilitiesInBounds = async (northEastLat, northEastLng, southWestLat, southWestLng) => {
    //console.log( "USERID : " + USERID );
    //console.log( "USERPREFERENCE : " + JSON.stringify(USERPREFERENCE, null, 2));
    try {
        const latMin = Math.min(northEastLat, southWestLat)
        const latMax = Math.max(northEastLat, southWestLat)
        const lngMin = Math.min(northEastLng, southWestLng)
        const lngMax = Math.max(northEastLng, southWestLng)

        const url = `${FORK_URL}api/map?latMin=${encodeURIComponent(latMin)}&lngMin=${encodeURIComponent(lngMin)}&latMax=${encodeURIComponent(latMax)}&lngMax=${encodeURIComponent(lngMax)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'foodie',
            }
        });

        //console.log("Response object:", response);
        //console.log("Status:", response.status);

        const jsonResponse = await response.json();
        //console.log("JSON data:", jsonResponse);

        const facilitiesData = jsonResponse.data;
        console.log("Facilities data:", JSON.stringify(facilitiesData, null, 2));

        return facilitiesData;

    } catch (error) {
        console.error('Error fetching facilities in real fetchMethod:', error);
        throw error;
    }
};

export const getParsedUserPreferences = () => {
    console.log("here and USERPREFERENCE:", JSON.stringify(USERPREFERENCE, null, 2));
    if (USERPREFERENCE && Array.isArray(USERPREFERENCE.data)) {
      console.log("Parsing preferences by IDs");
      return USERPREFERENCE.data.map(pref => pref.id);
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
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse the JSON from the response
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getUserByID = async (userID) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(userID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching use in getUserById:', error);
        throw error;
    }
};

export const getUserPreferences = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/preference/${encodeURIComponent(USERID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching user in getUserPreferences:', error);
        throw error;
    }
};

export const getUserFavorites = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};


export const isFacilityBookmarked = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}/has/${encodeURIComponent(facilityID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok got checking bookmarked');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stamp rule:', error);
        throw error;
    }
};

export const addFavorite = async (facilityId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            },
            body: JSON.stringify({ facilityId: (encodeURIComponent(facilityId)) })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};

export const deleteFavorite = async (facilityId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            },
            body: JSON.stringify({ facilityId: (encodeURIComponent(facilityId)) })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};


export const getFavoritesNotices = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(USERID)}/updates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};


// --------------FACILITY-----------------

export const getFacilityByID = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getFacilityStampRuleByID = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/stamp-ruleset`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stamp rule:', error);
        throw error;
    }
};

export const getFacilityPreferences = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/preferences`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stamp rule:', error);
        throw error;
    }
};

export const getFacilityMenu = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/menu`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stamp rule:', error);
        throw error;
    }
};

export const getFacilityOpeningHour = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/opening-hours`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stamp rule:', error);
        throw error;
    }
};


export const getTrendingFacilities = async () => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/leaderboard/trending?limit=${encodeURIComponent(5)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching trending facilities:', error);
        throw error;
    }
};

export const getNewestFacilities = async () => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/leaderboard/newest?limit=${encodeURIComponent(5)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching newest facilities:', error);
        throw error;
    }
};

export const getFacilityNotices = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}/post`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// --------------REVIEW-----------------

export const getReviewByQuery = async (userID, facilityId, hasImage, hashtags) => {
    try {
        // Construct query parameters
        const queryParams = new URLSearchParams();

        // Conditionally append parameters if they are not null
        if (facilityId) queryParams.append('facility', encodeURIComponent(facilityId));
        if (userID) queryParams.append('user', encodeURIComponent(userID));
        if (hasImage) queryParams.append('hasImage', encodeURIComponent(hasImage));
        if (hashtags) queryParams.append('hashtags', encodeURIComponent(hashtags));
        const queryString = queryParams.toString();

        const url = `${BASE_URL}/reviews?${queryString}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

// --------------STAMP-----------------

export const getFacilityStamp = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/stamps?user=${encodeURIComponent(USERID)}&facility=${encodeURIComponent(facilityID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.dat;
    } catch (error) {
        console.error('Error fetching facility stamp:', error);
        throw error;
    }
};

export const getStampBook = async () => {
    try {
        const response = await fetch(`${BASE_URL}/stamps?user=${encodeURIComponent(USERID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching facility stamp:', error);
        throw error;
    }
};

// --------------ADMIN-----------------

export const getFacilityRegistrations = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/facility-requests?status=0`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching facility registrations:', error);
        throw error;
    }
};

export const acceptFacilityRegistrations = async (requestID) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/facility-requests/${encodeURIComponent(requestID)}/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN,
            },
            body: JSON.stringify({
                adminId: USERID,
            })
        });
        console.log(response); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error accepting facility registrations:', error);
        throw error;
    }
};

export const declineFacilityRegistrations = async (requestID) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/facility-requests/${encodeURIComponent(requestID)}/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN,
            },
            body: JSON.stringify({
                adminId: USERID,
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error declining facility registrations:', error);
        throw error;
    }
};

export const getReports = async (type) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/reports?type=${encodeURIComponent(type)}&status=${encodeURIComponent(0)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
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
                'Authorization': USERTOKEN
            },
            body: JSON.stringify({
                authorId: USERID,
                type: 1,
                content: content,
                reviewId: reviewId
            })
        });
        const result = await response.json();
        console.log(result);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
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
                'Authorization': USERTOKEN
            },
            body: JSON.stringify({
                authorId: USERID,
                type: 0,
                content: content,
            })
        });
        const result = await response.json();
        console.log(content);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error sending bug report:', error);
        throw error;
    }
};

export const deleteReport = async (reportId) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/reports/delete/${encodeURIComponent(reportId)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USERTOKEN
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching facility registrations:', error);
        throw error;
    }
};