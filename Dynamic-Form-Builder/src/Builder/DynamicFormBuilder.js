import { FormBuilder } from "@tsed/react-formio";
import { useState, useEffect } from "react";
import "./DynamicFormBuilder.css";

export default function DynamicFormBuilder() {
  const [formLayout, setFormLayout] = useState([]);
  const [formName, setFormName] = useState("Form Name");
  const [edit, setEdit] = useState(false);

  function changeFormLayout(form) {
    setFormLayout(form);
  }

  function changeEdit() {
    setEdit((prev) => !prev);
  }

  async function loadFormLayout() {
    const form = [
      {
        type: "textfield",
        key: "firstName",
        label: "First Name",
        placeholder: "Enter your first name.",
        input: true,
        tooltip: "Enter your <strong>First Name</strong>",
        description: "Enter your <strong>First Name</strong>",
      },
      {
        type: "textfield",
        key: "lastName",
        label: "Last Name",
        placeholder: "Enter your last name",
        input: true,
        tooltip: "Enter your <strong>Last Name</strong>",
        description: "Enter your <strong>Last Name</strong>",
      },
    ];
    changeFormLayout(form);
  }



  async function saveFormLayout() {
    try {
      const response = await fetch("http://localhost:3000/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formLayout),
      });
      if (!response.ok) {
        alert("Could not save form!");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Form Saved!");
      console.log("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form layout:", error);
    }
  }

  useEffect(() => {
    loadFormLayout();
  }, []);

  return (
    <div className="form-builder-wrapper">
      <div id="form-header">
        <div id="form-title">
          <span style={{ display: edit ? "none" : "block" }}>{formName}</span>
          <span style={{ display: edit ? "block" : "none" }}>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </span>
          <div
            className="form-title-img"
            style={{ display: edit ? "block" : "none" }}
          >
            <img src="/close.png" alt="Close" onClick={changeEdit} />
          </div>
          <div
            className="form-title-img"
            style={{ display: edit ? "none" : "block" }}
          >
            <img src="/edit.png" alt="Edit" onClick={changeEdit} />
          </div>
        </div>
        <div>Client Name</div>
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
      <div className="dynamic-form-builder">
        {console.log(formLayout)}
        <FormBuilder
          display={"form"}
          components={formLayout}
          onChange={(schema) => changeFormLayout(schema)}
        />
      </div>
    </div>
  );
}
