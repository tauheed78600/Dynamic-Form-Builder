import { FormBuilder } from "@tsed/react-formio";
import { useRef } from "react";
import "./DynamicFormBuilder.css";

export default function DynamicFormBuilder() {
  const formLayout = useRef([]);
  function changeFormLayout(form) {
    formLayout.current = form;
  }
  async function saveFormLayout() {
    try {
      const response = await fetch("http://localhost:3000/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formLayout.current),
      });

      if (!response.ok) {
        alert("Could not save form!");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        alert("Form Saved!");
      }

      const data = await response.json();
      console.log("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form layout:", error);
    }
  }
  return (
    <div className="form-builder-wrapper">
      <div className="center">
        <h2>FORM BUILDER</h2>
      </div>
      <div className="dynamic-form-builder">
        <FormBuilder
          display={"form"}
          components={[]}
          onChange={(schema) => {
            changeFormLayout(schema);
          }}
        />
      </div>
      <div id="saveButtonDiv">
        <button
          id="saveFormButton"
          className="btn btn-primary btn-md"
          onClick={saveFormLayout}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
