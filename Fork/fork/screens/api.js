//const BASE_URL = 'http://ec2-52-65-3-109.ap-southeast-2.compute.amazonaws.com:80/api';

// This is the base-url that leads to all backend & S3
const API_ENDPOINT = "https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-dev";

// Backend API endpoint
const FORK_URL = `${API_ENDPOINT}/dev/`
// "API_PATH": "api/users" or any other method routes

// S3 endpoint
const S3_ENDPOINT = `${API_ENDPOINT}/s3`

export let USERTOKEN = "";

// --------------LOGIN----------------- 

export const handleLogin = async (username, password) => {
    console.log('in handleLogin : username => ' + username + ', password => ' + password);
    try {
        const url = `${FORK_URL}api/auth/login`;
        //?userId=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}
        console.log("url : " + url)
        const requestBody = {
            userId: username,
            password: password
        };
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "foodie"
        },
        body: JSON.stringify(requestBody)
        });
        console.log("response : " + response.status);
        if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("response : " + JSON.stringify(jsonResponse, null, 2));
        USERTOKEN = jsonResponse.data.token;
        console.log("USERTOKEN : " + USERTOKEN);
        
        } else {
        console.log('Login Failed', 'Invalid credentials or insufficient permissions.');
        }
    } catch (error) {
        console.log(error);
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

export const getAllUsders = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users`);
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
        //console.log("Facilities data:", facilitiesData);

        return facilitiesData; 
        
    } catch (error) {
        console.error('Error fetching facilities in real fetchMethod:', error);
        throw error;
    }
};

// --------------USER-----------------

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users`);
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
        const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(userID)}`);
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

export const getUserPreferences = async (userID) => {
    try {
        const response = await fetch(`${BASE_URL}/users/preference/${encodeURIComponent(userID)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getUserFavorites = async (userID) => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(userID)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
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
                'Content-Type': 'application/json'
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

export const addFavorite = async (userID, facilityId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(userID)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
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

export const deleteFavorite = async (userID, facilityId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/favorite/${encodeURIComponent(userID)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
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

// --------------FACILITY-----------------

export const getFacilityByID = async (facilityID) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityID)}`);
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
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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
            },
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
        const response = await fetch(`${BASE_URL}/stamps?user=${encodeURIComponent(USERID)}&facility=${encodeURIComponent(facilityID)}`);
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
        const response = await fetch(`${BASE_URL}/stamps?user=${encodeURIComponent(USERID)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching facility stamp:', error);
        throw error;
    }
};

getStampBook(2);