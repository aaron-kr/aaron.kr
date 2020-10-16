import { firestore, storage } from "./config";

export const createSiteDocument = async (site) => {
  // get ref to Firestore document
  const docRef = firestore.doc(`/sites/${site.uid}`);

  // create site Obj
  const siteProfile = {
    uid: site.uid,
    email: site.email,
    name: site.displayName,
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    specialty: "",
    ip: "",
  };

  // write to Cloud Firestore
  return docRef.set(siteProfile);
};

export const updateSiteDocument = async (site) => {
  const docRef = firestore.doc(`/sites/${site.uid}`);
  return docRef.update(site);
};

export const uploadImage = (siteId, file, progress) => {
  return new Promise((res, rej) => {
    // create file reference
    const filePath = `sites/${siteId}/site-image`;
    const fileRef = storage.ref().child(filePath);

    // upload task
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => progress(snapshot),
      (err) => rej(err),
      () => {
        res(uploadTask.snapshot.ref);
      }
    );
  });
};

export const getDownloadUrl = (siteId) => {
  const filePath = `sites/${siteId}/profile-image`;
  return storage
    .ref()
    .child(filePath)
    .getDownloadURL();
};
