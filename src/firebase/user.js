import { firestore } from "./config";

export const createUserDocument = async (user) => {
  // get ref to Firestore document
  const docRef = firestore.doc(`/users/${user.uid}`);

  // create user Obj
  const userProfile = {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    specialty: "",
    ip: "",
  };

  // write to Cloud Firestore
  return docRef.set(userProfile);
};

export const updateUserDocument = async (user) => {
  const docRef = firestore.doc(`/users/${user.uid}`);
  return docRef.update(user);
};
