const BASE_URL = 'http://ec2-52-65-3-109.ap-southeast-2.compute.amazonaws.com:80/api';

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


