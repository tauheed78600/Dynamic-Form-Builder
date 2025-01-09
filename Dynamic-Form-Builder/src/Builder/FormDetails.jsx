import React, { useEffect, useState } from 'react';
import { fetchFormDetails } from '../APICalls/ClientAPIs';
import { useParams } from 'react-router-dom';

function FormDetails({ userid }) {
  const [formDetails, setFormDetails] = useState([]);
  const { formId, clientId } = useParams();
  console.log("line 8 formId clientId", formId, clientId);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetchFormDetails(formId);
        console.log("res line 10", res);
        setFormDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching form details:", error);
      }
    };
    fetchForm();
  }, [formId]);

  return (
    <div className="p-4">
      {formDetails.length === 0 ? (
        <p className="text-gray-500">No form details available.</p>
      ) : (
        formDetails.map((form, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded-lg shadow-xl">
            <h3 className="font-bold text-lg mb-2">Form {idx + 1}</h3>
            <ul>
              {Object.entries(form).map(([key, value]) => (
                <li key={key} className="text-sm text-gray-700">
                  <strong>{key}: </strong>
                  {value !== undefined ? value.toString() : "N/A"}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default FormDetails;
