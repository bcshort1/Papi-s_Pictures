//Requisite modules. Express for server, path for file paths, mongoose for MongoDB.
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//Mongoose models.
const Media = require('./models/Media');
const LicensingAndService = require('./models/LicensingAndService');
const WhatsNew = require('./models/WhatsNew');

//Initialize Express app.
const app = express();

//Set the port for the server to listen on.
const PORT = 3000;

//MongoDB connection URI. Defaults to local instance.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/papis_pictures';

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

//Format a Date object to a readable string like "March 21, 2026".
function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

//Transform a MongoDB media document to the recentPictures API shape expected by the frontend.
function toRecentPicture(document) {
    const fileName = document.displayResolutionPath
        ? path.basename(document.displayResolutionPath)
        : document.fileName;
    return {
        id: document.legacyId,
        title: document.title,
        description: document.description,
        fileName: fileName,
        alt: document.alt,
        creator: document.creator,
        city: document.location?.city || '',
        state: document.location?.state || '',
        country: document.location?.country || '',
        imageWidth: document.metadata?.imageWidthPixels || 0,
        imageHeight: document.metadata?.imageHeightPixels || 0,
        featured: document.featured || false
    };
}

//Transform a MongoDB licensing/service document to the photoVideoServices API shape expected by the frontend.
function toService(document) {
    return {
        id: document.legacyId,
        serviceName: document.serviceName,
        serviceDescription: document.serviceDescription,
        price: document.price
    };
}

//Transform a MongoDB what's new document to the whatsNewItems API shape expected by the frontend.
function toWhatsNewItem(document) {
    return {
        id: document.legacyId,
        date: formatDate(document.date),
        title: document.title,
        description: document.description,
        tag: document.tag
    };
}

//Route for the root URL. Serves the index.html file from the public directory.
function serveHomePage(request, response) {
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
}

app.get('/', serveHomePage);

//Serve static files from the root public directory, and also from the assets and media directories. The staticOptions are applied to all of these routes to increase security and control caching behavior. This allows the client to access CSS, JavaScript, images, and other static assets needed for the frontend of the application.
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));
app.use('/media', express.static(path.join(__dirname, 'media', 'media_display'), staticOptions));

//API route to get the entire database (services, recent pictures, and what's new items).
async function getAllData(request, response) {
    try {
        const [services, media, whatsNew] = await Promise.all([
            LicensingAndService.find({ display: true, active: true }).sort({ sortOrder: 1 }).lean(),
            Media.find({ display: true, showOnHomepage: true }).sort({ homepageSortOrder: 1 }).lean(),
            WhatsNew.find({ display: true }).sort({ sortOrder: 1 }).lean()
        ]);

        response.json({
            photoVideoServices: services.map(toService),
            recentPictures: media.map(toRecentPicture),
            whatsNewItems: whatsNew.map(toWhatsNewItem)
        });
    } catch (error) {
        console.error('Error fetching API data:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
}

app.get('/api', getAllData);

//API route to get the recent pictures from the database.
async function getRecentPictures(request, response) {
    try {
        const documents = await Media.find({ display: true, showOnHomepage: true })
            .sort({ homepageSortOrder: 1 })
            .lean();
        response.json(documents.map(toRecentPicture));
    } catch (error) {
        console.error('Error fetching recent pictures:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
}

app.get('/api/recentPictures', getRecentPictures);

//Log the server URL once the server starts listening.
function onServerListening() {
    console.log(`Server is running on http://localhost:${PORT}`);
}

//Connect to MongoDB, then start the server.
async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB at ' + MONGO_URI);
        app.listen(PORT, onServerListening); 
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

startServer();
