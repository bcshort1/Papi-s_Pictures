//Requisite modules. Express for server, path for file paths.
const express = require('express');
const path = require('path');

//Initialize Express app.
const app = express();

//Set the port for the server to listen on.
const PORT = 3000;

//Load the database from the db.json file.
const db = require('./db.json');

//Options for serving static files, including security and caching settings.
const staticOptions = {
    //Deny access to dotfiles such as .env or .gitignore
    dotfiles: 'deny',

    //Etag is a header used for caching. Setting it to true allows clients to cache responses and validate them with the server.
    etag: true,

    //Set index to false to prevent serving index.html files automatically when a directory is requested. This can enhance security by not exposing directory contents.
    index: false,

    //Set maxAge to '0' to prevent caching of static files. This is useful during development to ensure that changes are reflected immediately.
    maxAge: '0'
};

//Route for the root URL. Serves the index.html file from the public directory.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Serve static files from the root public directory, and also from the assets and media directories. The staticOptions are applied to all of these routes to increase security and control caching behavior. This allows the client to access CSS, JavaScript, images, and other static assets needed for the frontend of the application.
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));
app.use('/media', express.static(path.join(__dirname, 'media', 'media_display'), staticOptions));

//API route to get the entire database.
app.get('/api', (req, res) => {
    //Respond with the contents of the db.json file as JSON. This allows the frontend to access all the data stored in the database.
    res.json(db);
});

//API route to getthe recent pictures from the database.
app.get('/api/recentPictures', (req, res) => {
    //Respond with the recentPictures array from the db.json file as JSON.
    res.json(db.recentPictures || []);
});

//Start the server and listen on the specified port.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
