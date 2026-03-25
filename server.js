//Get the Express framework.
const express = require('express');
//Get the path module to handle file paths.
const path = require('path');
//Create an instance of the Express application.
const app = express();
//Declare a variable to hold the port number on which the server will listen for incoming requests.
const PORT = 3000;

//Declare a variable to hold the contents of db.json, which will be used to serve API responses.
const db = require('./db.json');

//Define options for serving static files, such as denying access to dotfiles, enabling ETag headers, disabling directory indexing, and setting a cache max age of 1 day.
const staticOptions = {
    //Deny access to dotfiles (files starting with a dot, such as .env or .gitignore).
    dotfiles: 'deny',
    //Enable ETag headers for caching purposes, allowing clients to validate cached responses.
    etag: true,
    //Disable directory indexing, preventing clients from seeing a list of files in a directory if they request a directory URL.
    index: false,
    //Set the maximum age for caching static files to 1 day, allowing clients to cache these files for up to 24 hours.
    maxAge: '0'
};

//Define a route for the root URL ('/') that sends the index.html file located in the 'public' directory as the response.
app.get('/', (req, res) => {
    //Send the index.html file located in the 'public' directory as the response to the client.
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Serve static files from the 'public' directory, using the defined static options to control access and caching behavior.
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

//Serve static files from the entire 'assets' directory when requests are made to the '/assets' URL path.
app.use(
    //Path to serve static files from the 'assets' directory when requests are made to the '/assets' URL path.
    '/assets',
    //Serve static files from the 'assets' directory, including logo and welcome video assets.
    express.static(path.join(__dirname, 'assets'), staticOptions)
);

//Serve static files from the 'assets/logos_and_thumbnails' directory when requests are made to the '/assets/logos_and_thumbnails' URL path, using the defined static options to control access and caching behavior.
app.use(
    //Path to serve static files from the 'assets/logos_and_thumbnails' directory when requests are made to the '/assets/logos_and_thumbnails' URL path.
    '/assets/logos_and_thumbnails',
    //Serve static files from the 'assets/logos_and_thumbnails' directory, using the defined static options to control access and caching behavior.
    express.static(path.join(__dirname, 'assets', 'logos_and_thumbnails'), staticOptions)
);

//Serve static files from the 'assets/welcome_section_video' directory when requests are made to the '/assets/welcome_section_video' URL path.
app.use(
    //Path to serve static files from the 'assets/welcome_section_video' directory when requests are made to the '/assets/welcome_section_video' URL path.
    '/assets/welcome_section_video',
    //Serve static files from the 'assets/welcome_section_video' directory, using the defined static options to control access and caching behavior.
    express.static(path.join(__dirname, 'assets', 'welcome_section_video'), staticOptions)
);

//Serve static files from the 'media/media_display' directory when requests are made to the '/media' URL path, using the defined static options to control access and caching behavior.
app.use('/media', express.static(path.join(__dirname, 'media', 'media_display'), staticOptions));

//Define a route for the '/api' URL path that responds with the contents of the db variable in JSON format when a GET request is made to this path.
app.get('/api', (req, res) => {
    res.json(db);
});

app.get('/api/recentPictures', (req, res) => {
    res.json(db.recentPictures || []);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});