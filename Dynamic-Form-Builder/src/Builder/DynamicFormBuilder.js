import { FormBuilder } from "@tsed/react-formio";
import { useState, useEffect } from "react";
import "./DynamicFormBuilder.css";
import { Check, Clipboard, Copy, Edit2, MenuIcon, X } from "lucide-react";
import { addFormData, getFormData, editForm } from "../APICalls/ClientAPIs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog.tsx';
import PulseLoading from "../Loading/PulseLoading";

export default function DynamicFormBuilder() {
  const [formLayout, setFormLayout] = useState([]);
  const [formName, setFormName] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, showSuccess] = useState(false)
  const [error, showError] = useState(false)
  const [embed, showEmbed] = useState(false)
  const [copySuccess, setCopySuccess] = useState('');
  const[drop, openDrop] = useState(false)

  const location = useLocation();
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search);
  const formId = queryParams.get("formId");
  const clientId = queryParams.get("clientId")
  console.log("line 15", formId)

  function changeFormLayout(form) {
    setFormLayout(form);
  }

  const handleSubmittedForm = () => {
    navigate(`/form-details/${clientId}/${formId}`)
  }

  const iframeCode = `
      <iframe
        src={"http://localhost:3125/api/auth/getFormHTML/${formId}"}
        style={{ width: "100%", height: "500px" }}
        title="Iframe Example"
      ></iframe>`;

  async function changeEdit() {
    try {
      const res = await editForm(formId, formName);
      console.log("res line 66", res);
      setEdit(false)

    } catch (error) {
      console.error('Error in saveEditedForm:', error);
    }
  }

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

  async function loadFormLayout() {
    const res = await getFormData(formId)
    console.log("response of useEffect line 40", res)
    if (res.data.formLayout !== null) {
      changeFormLayout(res.data.formLayout);
    }
    else {
      changeFormLayout(form)
    }
    setFormName(res.data.formName)
    setLoading(false);
  }

  async function saveFormLayout() {
    console.log("RequestData in line 54", formLayout)
    try {
      const response = await addFormData(formId, formLayout)
      console.log("respone line 57", response)
      if (response.status !== 200) {
        showError(true)
      }
      else {
        showSuccess(true)
        console.log("Form saved successfully!");
      }
    } catch (error) {
      showError(true)
      console.error("Error saving form layout:", error);
    }
  }

  useEffect(() => {
    loadFormLayout();
  }, []);



  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(err => console.error("Error copying text: ", err));
  };

  return (
    <div className="form-builder-wrapper">
      <div id="form-header">
        <div id="form-title">
          <div>
          <span className="font-extrabold text-2xl" style={{ display: edit ? "none" : "block" }}>{formName}</span>
          <span style={{ display: edit ? "block" : "none" }}>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </span>
          </div>
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
            <Edit2 className="h-5 ml-9 mt-1" onClick={() => setEdit(true)} />
          </div>
        </div>
        {/* <div></div> */}
        <div className="flex items-center buttonDiv">
          <button onClick={handleSubmittedForm} className="bg-blue h-10 w-48 mr-2 bg-blue-600 text-white rounded-xl">
            See Submitted Forms
          </button>
          <button onClick={() => showEmbed(true)} className="bg-blue h-10 w-36 bg-blue-600 text-white rounded-xl">
            Embed Code
          </button>
          <button
            id="saveFormButton"
            className="bg-blue h-10 w-[120px] mr-2 bg-blue-600 text-white rounded-xl ml-4"
            onClick={saveFormLayout}
          >
            Save Changes
          </button>
        </div>
        <div className="flexj justify-end ml-24 menuButton relative">
        <MenuIcon onClick={()=>openDrop(true)}/>
          <div className="absolute">

          </div>
        </div>
      </div>
      <div className="dynamic-form-builder">
        {loading ? (
          <div><PulseLoading /></div>
        ) : (
          <>
            {console.log(formLayout)}
            <FormBuilder
              display={"form"}
              components={formLayout}
              onChange={changeFormLayout}
            />
          </>
        )}

        {embed && (
          <Dialog open={embed} onOpenChange={showEmbed}>
            <DialogContent className="h-auto">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-2xl text-blue-600 font-extrabold">Embedded Code</span>
                </DialogTitle>
                <DialogDescription>
                  <div className="w-[450px]">
                    <span className="mt-20 text-lg">
                      <p>Paste this Embed Code into your website code</p>
                    </span>
                    <div className="relative">
                      <div className="text-white font-mono bg-gray-700 h-auto w-[450px] p-4 overflow-auto break-words">
                        <button
                          onClick={handleCopy}
                          className="absolute top-2 right-2 bg-transparent text-white rounded"
                        >
                          {!copied ? <Clipboard className="h-5" /> : <Check className="h-5" />}
                        </button>
                        <span className="mt-1 block">{iframeCode}</span>
                      </div>
                    </div>

                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {success && (
          <Dialog open={success} onOpenChange={showSuccess}>
            <DialogContent className="h-auto">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-2xl text-green-600 font-extrabold">Save Success</span>
                </DialogTitle>
                <DialogDescription>
                  <span className="mt-20 text-lg">
                    <p>Your Form has been successfully saved</p>
                    <button
                      onClick={() => showSuccess(false)}
                      className="border border-blue-400 bg-blue-400 mt-4 h-[50px] w-[140px] rounded-lg text-white"
                    >
                      Okay
                    </button>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {error && (
          <Dialog open={error} onOpenChange={showError}>
            <DialogContent className="h-auto">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-xl">Add New Client</span>
                </DialogTitle>
                <DialogDescription>
                  <span className="mt-20 text-lg">
                    <button
                      className="border border-blue-400 bg-blue-400 mt-4 h-[50px] w-[140px] rounded-lg text-white"
                    >
                      Add Client
                    </button>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
