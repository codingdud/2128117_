const express = require('express');
const axios = require('axios');

const app = express();

// Define window size
const WINDOW_SIZE = 10;
// Define timeout for external requests
const TIMEOUT = 500;
// Variables to store the access token and its expiry time
let accessToken = '';
let accessTokenExpiry = 0;
// Variable to store the previous window state
let windowPrevState = []; // Initialize an empty array

// Function to fetch a new access token from the /test/auth endpoint
const fetchAccessToken = async () => {
    try {
        const authDetails =
        {
            "companyName":"google",
            "ownerName": "Animesh Kumar" ,
            "rollNo": "2128117",
            "ownerEmail": "2128117@kiit.ac.in",
            "accessCode":"mjPQGJ"
        }
            ;

        const response = await axios.post('http://20.244.56.144/test/auth', authDetails);
        accessToken = response.data.access_token;
        accessTokenExpiry = Date.now() + response.data.expires_in * 1000; // Convert expiry time to milliseconds
        console.log('New access token obtained:', accessToken);
        console.log('Access token expiry:', new Date(accessTokenExpiry));
    } catch (error) {
        console.log(error);
        console.error('Error fetching access token:', error.message);
    }
};

// Function to fetch numbers from the third-party server
const fetchNumbers = async (numberId) => {
    // Ensure access token is available and not expired
    if (!accessToken || Date.now() > accessTokenExpiry) {
        await fetchAccessToken();
    }

    const numberTypeEndpoints = {
        p: 'http://20.244.56.144/test/primes',
        f: 'http://20.244.56.144/test/fibo',
        e: 'http://20.244.56.144/test/even',
        r: 'http://20.244.56.144/test/rand',
    };

    const apiUrl = numberTypeEndpoints[numberId];
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            timeout: TIMEOUT
        });
        return response.data.numbers;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out:', error.message);
        } else {
            console.error('Error fetching numbers:', error.message);
        }
        return [];
    }
};

// Middleware to calculate average
const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

// Middleware to handle requests to "/numbers/{numberid}"
app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;

    // Store the current window state as the previous window state
    windowPrevState = [...windowPrevState];

    // Fetch numbers from the third-party server
    const numbers = await fetchNumbers(numberId);

    // Add unique numbers to the window
    const window = [];

    numbers.forEach(num => {
        if (!window.includes(num)) {
            window.push(num);
            // Remove oldest number if window size exceeds
            if (window.length > WINDOW_SIZE) {
                window.shift();
            }
        }
    });

    let average;
    let windowCurrState = [...window];

    // Calculate average if window size matches
    if (window.length === WINDOW_SIZE) {
        average = calculateAverage(windowCurrState);
    }

    res.json({
        windowPrevState,
        windowCurrState,
        numbers,
        avg: average !== undefined ? average.toFixed(2) : undefined,
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
