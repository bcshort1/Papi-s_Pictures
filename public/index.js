//Get hamburger menu and nav links elements from the DOM.
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

//Toggle the hamburger menu and nav links visibility when the hamburger icon is clicked.
function toggleMenu() {
    //Toggle the 'active' class on the hamburger menu and nav links to show or hide the navigation menu.
    hamburger.classList.toggle('active');
    //Toggle the 'active' class on the nav links to show or hide the navigation menu.
    navLinks.classList.toggle('active');
}

//Add click event listener to the hamburger menu to toggle the 'active' class on both the hamburger and nav links. This will show or hide the navigation menu when the hamburger icon is clicked.
hamburger.addEventListener('click', toggleMenu);

//Close the navigation menu by removing the 'active' class from both the hamburger and nav links.
function closeMenu() {
    //Remove the 'active' class from both the hamburger menu and nav links to close the navigation menu after a link is clicked.
    hamburger.classList.remove('active');
    //Remove the 'active' class from the nav links to close the navigation menu after a link is clicked.
    navLinks.classList.remove('active');
}

//Add click event listeners to each navigation link to remove the 'active' class from both the hamburger and nav links when a link is clicked. This will close the navigation menu after a link is selected.
var navigationLinks = navLinks.getElementsByTagName('a');
for (var i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', closeMenu);
}

//Close the navigation menu when the Escape key is pressed.
function closeMenuOnEscape(event) {
    if (event.key === 'Escape') {
        //Remove the 'active' class from both the hamburger menu and nav links to close the navigation menu when the Escape key is pressed.
        hamburger.classList.remove('active');
        //Remove the 'active' class from the nav links to close the navigation menu when the Escape key is pressed.
        navLinks.classList.remove('active');
    }
}

//Add a keydown event listener to the document to listen for the Escape key. When the Escape key is pressed, it will remove the 'active' class from both the hamburger and nav links, closing the navigation menu if it is open.
document.addEventListener('keydown', closeMenuOnEscape);

// Helper to safely set text content on an element.
function setText(element, tag, text) {
    //Create a new child element with the specified tag, set its text content, append it to the parent element, and return the child element. This is a utility function to simplify creating and populating elements in the DOM.
    var child = document.createElement(tag);
    //Set the text content of the child element to the provided text.
    child.textContent = text;
    //Append the child element to the parent element.
    element.appendChild(child);
    //Return the child element that was created and appended to the parent element.
    return child;
}

// Gallery section — fetch recent pictures from the API and populate the gallery grid.
const galleryGrid = document.getElementById('galleryGrid');

//Asynchronous function to fetch recent pictures from the API and update the gallery section of the page. It handles loading states, errors, and dynamically creates elements to display the pictures in a grid layout.
async function fetchGallery() {
    try {
        //Fetch the recent pictures from the API endpoint.
        const response = await fetch('/api/recentPictures');
        //Check if the response is OK (status in the range 200-299). If not, throw an error to be caught in the catch block.
        if (!response.ok) throw new Error('Fetch failed');
        //Parse the response as JSON to get the array of pictures.
        const pictures = await response.json();

        //If the response is empty or missing, show a message indicating that no pictures are available and return early.
        if (!pictures || pictures.length === 0) {
            //Set the gallery grid's inner HTML to a message indicating that no pictures are available.
            galleryGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;">No pictures available right now.</p>';
            //Return from the function to avoid further processing since there are no pictures to display. 
            return;
        }

        //Filter function to check if a picture is not featured.
        function isNotFeatured(picture) { return !picture.featured; }

        //Filter function to check if a picture is featured.
        function isFeatured(picture) { return picture.featured; }

        //Separate the pictures into small pictures (not featured) and the featured picture using a filter.
        const smallPictures = pictures.filter(isNotFeatured);
        const featuredPicture = pictures.find(isFeatured);

        //Clear the gallery grid before adding new content.
        galleryGrid.innerHTML = '';

        //Create a new div for the small pictures.
        var smallGrid = document.createElement('div');
        //Set the class name for the small pictures grid to apply appropriate styling.
        smallGrid.className = 'gallery-small-grid';
        //Loop through the small pictures and create elements for each one, appending them to the small grid.
        for (const picture of smallPictures) {
            //Create a new div for each gallery item.
            var item = document.createElement('div');
            //Set the class name for the gallery item to apply appropriate styling.
            item.className = 'gallery-item';
            //Create an image element for the picture.
            var image = document.createElement('img');
            //Set the src attribute of the image element to the file path of the picture, encoding the file name to ensure it is URL-safe.
            image.src = '/media/' + encodeURIComponent(picture.fileName);
            //Set the alt attribute of the image element to the alt text from the picture data for accessibility.
            image.alt = picture.alt;
            //Append the image element to the gallery item div.
            item.appendChild(image);
            //Append the gallery item div to the small grid div.
            smallGrid.appendChild(item);
        }
        //Append the small grid div to the main gallery grid.
        galleryGrid.appendChild(smallGrid);

        //If there is a featured picture, create a larger gallery item for it and append it to the gallery grid.
        if (featuredPicture) {
            //Create a new div for the large gallery item.
            var largeItem = document.createElement('div');
            //Set the class name for the large gallery item to apply appropriate styling, including making it larger than the small items.
            largeItem.className = 'gallery-large gallery-item';
            //Create an image element for the featured picture.
            var image = document.createElement('img');
            //Set the src attribute of the image element to the file path of the featured picture, encoding the file name to ensure it is URL-safe.
            image.src = '/media/' + encodeURIComponent(featuredPicture.fileName);
            //Set the alt attribute of the image element to the alt text from the featured picture data for accessibility.
            image.alt = featuredPicture.alt;
            //Append the img element to the large gallery item div.
            largeItem.appendChild(image);
            //Append the large gallery item div to the main gallery grid, ensuring it is displayed alongside the small pictures.
            galleryGrid.appendChild(largeItem);
        }
    } catch (error) {
        //If an error occurs during the fetch or processing of the pictures, log the error to the console.
        console.error(error);
        //Set the gallery grid's inner HTML to a message indicating that the gallery could not be loaded due to an error.
        galleryGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;">Unable to load gallery.</p>';
    }
}

//Call the fetchGallery function to load the recent pictures and populate the gallery section when the page loads.
fetchGallery();

// Services and What's New sections — fetch from API.
//Get the services grid and what's new grid elements from the DOM to populate them with data fetched from the API.
const servicesGrid = document.getElementById('servicesGrid');
//Get the what's new grid element from the DOM to populate it with data fetched from the API.
const whatsNewGrid = document.getElementById('whatsNewGrid');

//Asynchronous function to fetch services and what's new items from the API and update the respective sections of the page. It handles loading states, errors, and dynamically creates elements to display the services and updates in a grid layout.
async function fetchServices() {
    try {
        //Fetch the entire database from the API endpoint.
        const response = await fetch('/api');
        //Check if the response is OK (status in the range 200-299). If not, throw an error to be caught in the catch block.
        if (!response.ok) throw new Error('Fetch failed');
        //Parse the response as JSON to get the data object containing services and what's new items.
        const data = await response.json();

        //Extract the photo/video services and what's new items from the data, ensuring they are arrays. If they are not arrays, default to empty arrays to prevent errors during processing.
        const serviceItems = data.photoVideoServices || [];
        //Extract the what's new items from the data, ensuring it is an array. If it is not an array, default to an empty array to prevent errors during processing.
        const whatsNewItems = data.whatsNewItems || [];

        //Clear the services grid and what's new grid before adding new content.
        servicesGrid.innerHTML = '';
        whatsNewGrid.innerHTML = '';

        //If there are no service items.
        if (serviceItems.length === 0) {
            //Set the services grid's inner HTML to a message indicating that no services are available.
            servicesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">No services available right now.</p>';
        }

        //If there are no what's new items.
        if (whatsNewItems.length === 0) {
            //Set the what's new grid's inner HTML to a message indicating that no updates have been posted yet.
            whatsNewGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">No updates posted yet.</p>';
        }

        //Loop through the service items and create elements for each one, appending them to the services grid.
        for (const service of serviceItems) {
            //Create a new div for each service card.
            var card = document.createElement('div');
            //Set the class name for the service card to apply appropriate styling.
            card.className = 'service-card';

            //Use the setText helper function to create and append elements for the service name, description, and price within the service card.
            setText(card, 'h3', service.serviceName);
            //Use the setText helper function to create and append a paragraph element for the service description within the service card.
            setText(card, 'p', service.serviceDescription);

            //Create a new div for the service price and set its class name for styling. Format the price with a dollar sign and use toLocaleString to add commas for thousands. Append a span element to indicate that the price is per each service.
            var priceDiv = document.createElement('div');
            //Set the class name for the service price div to apply appropriate styling.
            priceDiv.className = 'service-price';
            //Set the text content of the price div to the formatted price, including a dollar sign and commas for thousands, followed by a span indicating that the price is per each service.
            priceDiv.textContent = '$' + service.price.toLocaleString() + ' ';
            //Create a span element to indicate that the price is per each service and append it to the price div.
            var span = document.createElement('span');
            //Set the text content of the span element to indicate that the price is per each service.
            span.textContent = '/ each';
            //Append the span element to the price div, and then append the price div to the service card.
            priceDiv.appendChild(span);
            //Append the price div to the service card to display the price information within the card.
            card.appendChild(priceDiv);

            //Append the service card to the services grid to display it on the page.
            servicesGrid.appendChild(card);
        }

        //Loop through the what's new items and create elements for each one, appending them to the what's new grid.
        for (const item of whatsNewItems) {
            //Create a new div for each what's new card.
            var card = document.createElement('div');
            //Set the class name for the what's new card to apply appropriate styling.
            card.className = 'whatsnew-card';

            //Use the setText helper function to create and append elements for the update date, title, description, and tag within the what's new card. The date is given a specific class name for styling, and the tag is also styled with its own class name.
            var dateDiv = setText(card, 'div', item.date);
            //Set the class name for the date div to apply appropriate styling.
            dateDiv.className = 'whatsnew-date';

            //Use the setText helper function to create and append an h3 element for the update title and a paragraph element for the update description within the what's new card.
            setText(card, 'h3', item.title);
            setText(card, 'p', item.description);

            //Create a span element for the update tag.
            var tag = setText(card, 'span', item.tag);
            //Set the class name for the tag span to apply appropriate styling.
            tag.className = 'whatsnew-tag';

            //Append the what's new card to the what's new grid to display it on the page.
            whatsNewGrid.appendChild(card);
        }
    } catch (error) {
        //If an error occurs during the fetch or processing of the services and what's new items, log the error to the console.
        console.error(error);
        //Set the services grid and what's new grid's inner HTML to messages indicating that the data could not be loaded due to an error.
        servicesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">Unable to load services.</p>';
        whatsNewGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">Unable to load updates.</p>';
    }
}

//Call the fetchServices function to load the services and what's new items and populate the respective sections when the page loads.
fetchServices();
