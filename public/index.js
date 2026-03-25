// Hamburger menu functionality.
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Helper to safely set text content on an element.
function setText(el, tag, text) {
    var child = document.createElement(tag);
    child.textContent = text;
    el.appendChild(child);
    return child;
}

// Gallery section — fetch recent pictures from the API and populate the gallery grid.
const galleryGrid = document.getElementById('galleryGrid');

async function fetchGallery() {
    try {
        const res = await fetch('/api/recentPictures');
        if (!res.ok) throw new Error('Fetch failed');
        const pictures = await res.json();

        if (!Array.isArray(pictures) || pictures.length === 0) {
            galleryGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;">No pictures available right now.</p>';
            return;
        }

        const smallPictures = pictures.filter(function (p) { return !p.featured; });
        const featuredPicture = pictures.find(function (p) { return p.featured; });

        galleryGrid.innerHTML = '';

        var smallGrid = document.createElement('div');
        smallGrid.className = 'gallery-small-grid';
        smallPictures.forEach(function (pic) {
            var item = document.createElement('div');
            item.className = 'gallery-item';
            var img = document.createElement('img');
            img.src = '/media/' + encodeURIComponent(pic.fileName);
            img.alt = pic.alt;
            item.appendChild(img);
            smallGrid.appendChild(item);
        });
        galleryGrid.appendChild(smallGrid);

        if (featuredPicture) {
            var largeItem = document.createElement('div');
            largeItem.className = 'gallery-large gallery-item';
            var img = document.createElement('img');
            img.src = '/media/' + encodeURIComponent(featuredPicture.fileName);
            img.alt = featuredPicture.alt;
            largeItem.appendChild(img);
            galleryGrid.appendChild(largeItem);
        }
    } catch (err) {
        console.error(err);
        galleryGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;">Unable to load gallery.</p>';
    }
}

fetchGallery();

// Services and What's New sections — fetch from API.
const servicesGrid = document.getElementById('servicesGrid');
const whatsNewGrid = document.getElementById('whatsNewGrid');

async function fetchServices() {
    try {
        const res = await fetch('/api');
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();

        const serviceItems = Array.isArray(data.photoVideoServices) ? data.photoVideoServices : [];
        const whatsNewItems = Array.isArray(data.whatsNewItems) ? data.whatsNewItems : [];

        servicesGrid.innerHTML = '';
        whatsNewGrid.innerHTML = '';

        if (serviceItems.length === 0) {
            servicesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">No services available right now.</p>';
        }

        if (whatsNewItems.length === 0) {
            whatsNewGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">No updates posted yet.</p>';
        }

        serviceItems.forEach(function (svc) {
            var card = document.createElement('div');
            card.className = 'service-card';

            setText(card, 'h3', svc.serviceName);
            setText(card, 'p', svc.serviceDescription);

            var priceDiv = document.createElement('div');
            priceDiv.className = 'service-price';
            priceDiv.textContent = '$' + svc.price.toLocaleString() + ' ';
            var span = document.createElement('span');
            span.textContent = '/ each';
            priceDiv.appendChild(span);
            card.appendChild(priceDiv);

            servicesGrid.appendChild(card);
        });

        whatsNewItems.forEach(function (item) {
            var card = document.createElement('div');
            card.className = 'whatsnew-card';

            var dateDiv = setText(card, 'div', item.date);
            dateDiv.className = 'whatsnew-date';

            setText(card, 'h3', item.title);
            setText(card, 'p', item.description);

            var tag = setText(card, 'span', item.tag);
            tag.className = 'whatsnew-tag';

            whatsNewGrid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        servicesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">Unable to load services.</p>';
        whatsNewGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;opacity:0.5;">Unable to load updates.</p>';
    }
}

fetchServices();
