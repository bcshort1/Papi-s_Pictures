// Hamburger menu functionality.

// Get the hamburger menu and navigation links elements by their IDs.
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Add a click event listener to the hamburger menu to toggle the active class on both the hamburger menu and the navigation links.
hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close the mobile menu when a navigation link is clicked.
navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Add a keydown event listener to close the dropdown menu by pressing Escape.
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Gallery section - fetch recent pictures from the API and populate the gallery grid.

// Get the gallery grid element by its ID.
const galleryGrid = document.getElementById('galleryGrid');

// Declare an asynchronous function to fetch recent pictures from the API.
async function fetchGallery() {
    try {
        const res = await fetch('/api/recentPictures');
        if (!res.ok) throw new Error('Fetch failed');
        const pictures = await res.json();

        if (!Array.isArray(pictures) || pictures.length === 0) {
            galleryGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;">No pictures available right now.</p>';
            return;
        }

        // Separate featured and non-featured images.
        const smallPictures = pictures.filter(function (p) { return !p.featured; });
        const featuredPicture = pictures.find(function (p) { return p.featured; });

        // Build the gallery HTML.
        galleryGrid.innerHTML = '';

        // Create the smaller grid of images on the left side.
        const smallGrid = document.createElement('div');
        smallGrid.className = 'gallery-small-grid';
        smallPictures.forEach(function (pic) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = '<img src="/media/' + encodeURIComponent(pic.fileName) + '" alt="' + pic.alt + '">';
            smallGrid.appendChild(item);
        });
        galleryGrid.appendChild(smallGrid);

        // Create the larger featured image on the right side.
        if (featuredPicture) {
            const largeItem = document.createElement('div');
            largeItem.className = 'gallery-large gallery-item';
            largeItem.innerHTML = '<img src="/media/' + encodeURIComponent(featuredPicture.fileName) + '" alt="' + featuredPicture.alt + '">';
            galleryGrid.appendChild(largeItem);
        }
    } catch (err) {
        console.error(err);
        galleryGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;">Unable to load gallery.</p>';
    }
}

// Call the fetchGallery function to load the gallery when the page loads.
fetchGallery();

// Services section - fetch data from the API and populate the services grid.

// Get the services grid element by its ID.
const servicesGrid = document.getElementById('servicesGrid');
// Get the What's New grid element by its ID.
const whatsNewGrid = document.getElementById('whatsNewGrid');

// Declare an asynchronous function to fetch the services data from the Node.js API endpoint.
async function fetchServices() {
    try {
        // Fetch the services data from the /api endpoint served by our Express server.
        const res = await fetch('/api');

        // If response is not ok, throw an error to be caught in the catch block.
        if (!res.ok) throw new Error('Fetch failed');

        // Parse the JSON data from the response.
        const data = await res.json();
        const serviceItems = Array.isArray(data.photoVideoServices) ? data.photoVideoServices : [];
        const whatsNewItems = Array.isArray(data.whatsNewItems) ? data.whatsNewItems : [];
        // Clear the services grid before populating it with new service cards.
        servicesGrid.innerHTML = '';
        // Clear the What's New grid before populating it with update cards.
        whatsNewGrid.innerHTML = '';

        if (serviceItems.length === 0) {
            servicesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">No services available right now.</p>';
        }

        if (whatsNewItems.length === 0) {
            whatsNewGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">No updates posted yet.</p>';
        }

        // Iterate over the photoVideoServices array in the fetched data and create a service card for each service.
        serviceItems.forEach(function (svc) {
            // Create a new div element for each service card.
            const card = document.createElement('div');
            // Set the class name of the card to 'service-card'.
            card.className = 'service-card';
            // Set the inner HTML of the card to include the service name, description, and price.
            card.innerHTML = `
                <h3>${svc.serviceName}</h3>
                <p>${svc.serviceDescription}</p>
                <div class="service-price">$${svc.price.toLocaleString()} <span>/ each</span></div>
            `;
            servicesGrid.appendChild(card);
        });

        // Iterate over the whatsNewItems array and create an update card for each item.
        whatsNewItems.forEach(function (item) {
            const card = document.createElement('div');
            card.className = 'whatsnew-card';
            card.innerHTML = `
                <div class="whatsnew-date">${item.date}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="whatsnew-tag">${item.tag}</span>
            `;
            whatsNewGrid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        servicesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">Unable to load services.</p>';
        whatsNewGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">Unable to load updates.</p>';
    }
}
// Call the fetchServices function to load the services when the page loads.
fetchServices();
