import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/config";

const Sites = () => {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const sitesRef = firestore.collection("sites");
    const unsubscribe = sitesRef.onSnapshot((querySnapshot) => {
      const sites = querySnapshot.docs.map((doc) => doc.data());
      setSites(sites);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <table className="ui selectable celled table">
        <thead>
          <tr>
            <th>Img</th>
            <th>Name</th>
            <th>Purpose</th>
            <th>Expiration</th>
            <th>Sth</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.uid}>
              <td>
                <Link to={`/site/${site.uid}`}>{site.name}</Link>
              </td>
              <td>{site.specialty}</td>
              <td>
                {site.address}
                <br />
                {site.city}, {site.state} {site.zip}
              </td>
              <td>{site.phone}</td>
              <td>{site.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sites;
