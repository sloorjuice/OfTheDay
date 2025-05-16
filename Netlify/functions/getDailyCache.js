// getDailyCache.js (updated to use Firebase)
const { db } = require("./FirebaseConfig");
const { getDoc, doc } = require("firebase/firestore");

exports.handler = async () => {
  try {
    // Get the latest cache from Firebase
    const docRef = doc(db, "dailyCache", "latest");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Cache not yet created in Firebase." })
      };
    }

    // Return the data from Firebase
    return {
      statusCode: 200,
      body: JSON.stringify(docSnap.data()),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (err) {
    console.error("Firebase read error:", err);
    return {
      statusCode: 500,
      body: `Firebase read error: ${err.message}`
    };
  }
};