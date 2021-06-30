import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSession } from "../firebase/UserProvider";
import { firestore } from "../firebase/config";
import { updateSiteDocument } from "../firebase/site";
import { SiteImg } from "../components/SiteImg";

const SiteAdd = () => {
  const { user } = useSession();
  const params = useParams();
  const { register, setValue, handleSubmit } = useForm();
  // const [siteDocument, setSiteDocument] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(
    () => {
      // const docRef = firestore.collection("sites").doc(params.id);
      // // Real-time changes
      // const unsubscribe = docRef.onSnapshot((doc) => {
      //   if (doc.exists) {
      //     const documentData = doc.data();
      //     setSiteDocument(documentData);

      //     const formData = Object.entries(documentData).map((entry) => ({
      //       [entry[0]]: entry[1],
      //     }));

      //     // setValue array only works with API v.5
      //     setValue(formData);
      //   }
      // });
      // return unsubscribe;

      // Non-real-time changes
      // docRef.get().then((document) => {
      //   if (document.exists) {
      //     setUserDocument(document.data());
      //   }
      // });
    },
    [user.uid, setValue, params.id]
  );

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateSiteDocument({ uid: params.id, ...data });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // if (!siteDocument) {
  //   return null;
  // }

  const formClassname = `ui big form ${isLoading ? "loading" : ""}`;

  return (
    <div
      className="add-form-container"
      style={{ maxWidth: 960, margin: "50px auto" }}
    >
			SITE ADD!!
      <div className="ui grid stackable">
        <SiteImg id={params.id} />

        <form className={formClassname} onSubmit={handleSubmit(onSubmit)}>
          <div className="fields">
            <div className="eight wide field">
              <label>
                Name
                <input type="text" name="name" ref={register} />
              </label>
            </div>
            <div className="eight wide field">
              <label>
                Purpose
                <input type="text" name="purpose" ref={register} />
              </label>
            </div>
          </div>
          <div className="fields">
            <div className="six wide field">
              <label>
                Sth
                <input type="text" name="address" ref={register} />
              </label>
            </div>
            <div className="five wide field">
              <label>
                City
                <input type="text" name="city" ref={register} />
              </label>
            </div>
            <div className="two wide field">
              <label>
                State
                <input type="text" name="state" ref={register} />
              </label>
            </div>
            <div className="three wide field">
              <label>
                Zip
                <input type="text" name="zip" ref={register} />
              </label>
            </div>
          </div>
          <div className="equal width fields">
            <div className="field">
              <label>
                Phone
                <input type="text" name="phone" ref={register} />
              </label>
            </div>
            <div className="field">
              <label>
                Specialty
                <select className="specialty" name="specialty" ref={register}>
                  <option value="field agent">Field Agent</option>
                  <option value="covert operations">Covert Operations</option>
                  <option value="intelligence officer">
                    Intelligence Officer
                  </option>
                </select>
              </label>
            </div>
            <div className="field">
              <label>
                ip
                <input type="text" name="ip" ref={register} />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="ui submit large grey button right floated"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SiteAdd;
