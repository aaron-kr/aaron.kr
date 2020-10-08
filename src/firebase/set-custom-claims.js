var admin = require("firebase-admin");

var serviceAccount = require("./aaronkr-hub-firebase-adminsdk-dekb1-81b20c2a03.json");

var uid = process.argv[2];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aaronkr-hub.firebaseio.com",
});

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("custom claims set for user", uid);
    process.exit();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
