const admin = require('firebase-admin');
const serviceAccount = require("./service-key.json"); 

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const collections = ['products', 'doctors', 'users', 'consultations', 'pending_orders', 'mail'];

async function flattenAndMigrate() {
  console.log("🚀 Starting Flatten & Migrate Scan...");

  for (const colName of collections) {
    const snapshot = await db.collection(colName).get();
    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      let needsUpdate = false;
      let updatedData = {};

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && value.includes('studio-7312981180-d37fd')) {
          // 1. Switch the Project ID
          let newUrl = value.replace('studio-7312981180-d37fd', 'shreevarma-india-location');

          // 2. Remove folder paths (e.g., change 'products%2Fimage.jpg' to 'image.jpg')
          // Note: Firebase Storage URLs use %2F for slashes
          if (newUrl.includes('%2F')) {
             const parts = newUrl.split('%2F');
             const fileName = parts[parts.length - 1]; // Keep only the last part (the filename)
             const baseUrl = newUrl.split('/o/')[0] + '/o/';
             const tokenPart = newUrl.split('?')[1]; // Keep the security token if it exists
             
             newUrl = `${baseUrl}${fileName}${tokenPart ? '?' + tokenPart : ''}`;
          }

          updatedData[key] = newUrl;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        batch.update(doc.ref, updatedData);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`✅ Fixed and Flattened ${count} links in: ${colName}`);
    }
  }
  console.log("\n✨ Done! URLs are now pointing to the India root folder.");
}

flattenAndMigrate().catch(console.error);