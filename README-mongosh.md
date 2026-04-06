# Running MongoDB schema and seed scripts

From the project root (`/home/bcshort/Desktop/Papi's Pictures`) run the following commands with `mongosh` installed.

1) Create collections and validation rules:

```bash
mongosh --quiet --file playground-1-schema-setup.mongodb.js
```

2) Seed the database with sample data:

```bash
mongosh --quiet --file playground-2-seed-data.mongodb.js
```

3) Run both in sequence (recommended for a fresh DB):

```bash
mongosh --quiet --file playground-1-schema-setup.mongodb.js && mongosh --quiet --file playground-2-seed-data.mongodb.js
```

Notes:
- If re-running against the same database, you may want to drop the `papispictures` database first:

```bash
mongosh --eval "db.getSiblingDB('papispictures').dropDatabase()"
```

- The seed script now uses string arguments for `NumberLong`/`NumberInt` to avoid deprecation warnings and will auto-generate `slug` values when a `title` is present.
