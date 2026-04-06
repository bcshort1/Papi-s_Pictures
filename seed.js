const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Media = require('./models/Media');
const LicensingAndService = require('./models/LicensingAndService');
const WhatsNew = require('./models/WhatsNew');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/papis_pictures';
const DB_DIR = path.join(__dirname, 'db', 'papis_pictures');

//Convert MongoDB Extended JSON types ($oid, $date, $numberDecimal) to native JS types.
function convertExtendedJSON(object) {
  if (object === null || object === undefined) return object;
  if (Array.isArray(object)) return object.map(convertExtendedJSON);
  if (typeof object !== 'object') return object;

  if (object.$oid) return new mongoose.Types.ObjectId(object.$oid);
  if (object.$date) return new Date(object.$date);
  if (object.$numberDecimal !== undefined) return parseFloat(object.$numberDecimal);

  const result = {};
  for (const [key, value] of Object.entries(object)) {
    result[key] = convertExtendedJSON(value);
  }
  return result;
}

//Read and parse a JSON file from the db export directory, converting Extended JSON types.
function loadJSON(filename) {
  const filePath = path.join(DB_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.map(convertExtendedJSON) : [convertExtendedJSON(parsed)];
}

//Upsert documents into a collection using slug as the unique key for duplicate prevention.
async function upsertDocuments(Model, documents, label) {
  console.log(`Seeding ${documents.length} ${label} document(s)...`);
  let inserted = 0;
  let updated = 0;

  for (const document of documents) {
    const { _id, ...rest } = document;
    const result = await Model.updateOne(
      { slug: rest.slug },
      { $set: rest },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted++;
    else if (result.modifiedCount > 0) updated++;
  }

  console.log(`  ${label}: ${inserted} inserted, ${updated} updated, ${documents.length - inserted - updated} unchanged.`);
}

async function seed() {
  console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.\n');

  const mediaDocuments = loadJSON("papi's_pictures.media.json");
  await upsertDocuments(Media, mediaDocuments, 'Media');

  const servicesDocuments = loadJSON("papi's_pictures.licensing_and_services.json");
  await upsertDocuments(LicensingAndService, servicesDocuments, 'Licensing & Services');

  const whatsNewDocuments = loadJSON("papi's_pictures.whats_new.json");
  await upsertDocuments(WhatsNew, whatsNewDocuments, "What's New");

  console.log('\nAll collections seeded successfully.');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

//Handle seed failure by logging the error and exiting with a non-zero status code.
function handleSeedError(error) {
  console.error('Seed failed:', error);
  process.exit(1);
}

seed().catch(handleSeedError);
