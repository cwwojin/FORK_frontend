const BASE_URL = 'http://ec2-52-65-3-109.ap-southeast-2.compute.amazonaws.com:80/api';


// This is the base-url that leads to all backend & S3
const API_ENDPOINT = "https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-dev";

// Backend API endpoint
const FORK_URL = `${API_ENDPOINT}/dev/`
// "API_PATH": "api/users" or any other method routes

// S3 endpoint
const S3_ENDPOINT = `${API_ENDPOINT}/s3`

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

export const USERID = 1;

// Define mock data that includes latitude, longitude, and average score
const mockData = [
    {
        id: 1,
        name: 'Facility One',
        location: 'Location One',
        lat: 36.3626,
        lng: 127.3443,
        avg_score: 4.2,
        description: "This restaurant offers a range of gourmet dishes crafted with the finest local ingredients.",
        phone: "012-3456-7890",
        opening_hours: [
            { day: 0, open_time: '10:00', close_time: '22:00' }, // Sunday
            { day: 1, open_time: '09:00', close_time: '23:00' }, // Monday
            { day: 2, open_time: '09:00', close_time: '23:00' }, // Tuesday
            { day: 3, open_time: '09:00', close_time: '23:00' }, // Wednesday
            { day: 4, open_time: '09:00', close_time: '23:00' }, // Thursday
            { day: 5, open_time: '09:00', close_time: '24:00' }, // Friday
            { day: 6, open_time: '10:00', close_time: '24:00' }, // Saturday
        ],
        profile_img_uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA_ERPZ2DLRz6vez_hwRoqrFRDT7duyErkKw2gjPj4VA&s"
    },
    {
        id: 2,
        name: 'Facility Two',
        location: 'Location Two',
        lat: 36.3725,
        lng: 127.3618,
        avg_score: 3.5,
        description: "Enjoy a casual dining experience with family and friends, known for its relaxed atmosphere and classic dishes.",
        phone: "019-8765-4321",
        opening_hours: [
            { day: 0, open_time: '09:00', close_time: '21:00' }, // Sunday
            { day: 1, open_time: '10:00', close_time: '22:00' }, // Monday
            { day: 2, open_time: '10:00', close_time: '22:00' }, // Tuesday
            { day: 3, open_time: '10:00', close_time: '17:00' }, // Wednesday
            { day: 4, open_time: '10:00', close_time: '15:00' }, // Thursday
            { day: 5, open_time: '10:00', close_time: '14:00' }, // Friday
            { day: 6, open_time: '09:00', close_time: '23:00' }, // Saturday
        ],
        profile_img_uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzAO1cza1-jm62Y60DsaeKQwCoJF6Q8l-cYw&s"
    }
];
export const fetchFacilityWithName = async (facilityName) => {
    try {
        const response = await fetch(`${BASE_URL}/facilities?name=${encodeURIComponent(facilityName)}`);
        console.log('Response in real fetchMethod: ', response)
        if (!response.ok) {
            throw new Error('Network response was not ok in real fetchMethod');
        }
        return await response.json();
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

        const url = `${BASE_URL}/map?latMin=${encodeURIComponent(latMin)}&lngMin=${encodeURIComponent(lngMin)}&latMax=${encodeURIComponent(latMax)}&lngMax=${encodeURIComponent(lngMax)}`;
        const response = await fetch(url);
       
        if (!response.ok) {
            throw new Error('Network response was not ok in real fetchMethod');
        }

        const jsonResponse = await response.json();
        const facilitiesData = jsonResponse.data; 
        console.log('JSON Response in real fetchMethod:', facilitiesData);
        return facilitiesData;
        
    } catch (error) {
        console.error('Error fetching facilities in real fetchMethod:', error);
        throw error;
    }
};

export const mockFetchFacilityWithName = async (query) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("In mock name fetching");

    // Only return facilities that match the query if the query is not empty
    if (query.trim()) {
        console.log("About to return mockData");
        return mockData.filter(facility => facility.name.toLowerCase().includes(query.toLowerCase()));
    }

    // If the query is empty or does not specifically match, return an empty array
    return [];
};

export const mockFetchFacilitiesInBounds = async (northEastLat, northEastLng, southWestLat, southWestLng) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("In mock bound fetching");
    console.log("Inputs:", northEastLat);
    // Return facilities that are within the bounds
    return mockData.filter(facility => {
        console.log("Facility Lat:", facility.lat);
        console.log("Max Lat:", Math.max(northEastLat, southWestLat));
        console.log("Min Lat:", Math.min(northEastLat, southWestLat));
        console.log("Facility Long:", facility.lng);
        console.log("Max Long:", Math.max(northEastLng, southWestLng));
        console.log("Min Long:", Math.min(northEastLng, southWestLng));
        return facility.lat <= Math.max(northEastLat, southWestLat) &&
            facility.lat >= Math.min(northEastLat, southWestLat) &&
            facility.lng <= Math.max(northEastLng, southWestLng) &&
            facility.lng >= Math.min(northEastLng, southWestLng);
    });
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