const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  legacyId: Number,
  slug: { type: String, unique: true, required: true },
  mediaType: String,
  title: String,
  description: String,
  alt: String,
  fileName: String,
  fullResolutionLogolessPath: String,
  displayResolutionPath: String,
  thumbnailPath: String,
  creator: String,
  galleries: [{
    gallerySlug: String,
    galleryName: String,
    galleryPosition: Number
  }],
  tags: [String],
  display: Boolean,
  showOnHomepage: Boolean,
  homepageSortOrder: Number,
  featured: Boolean,
  capturedAt: Date,
  ingestedAt: Date,
  location: {
    city: String,
    state: String,
    country: String
  },
  metadata: {
    imageWidthPixels: Number,
    imageHeightPixels: Number,
    aspectRatio: Number,
    cameraMake: String,
    cameraModel: String,
    aperture: String,
    exposureTime: String,
    iso: Number,
    focalLength: String,
    lensModel: String,
    gpsLatitude: Number,
    gpsLongitude: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema, 'media');
