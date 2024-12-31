import { useSearchParams } from "react-router-dom";
import "./EmbedForm.css";
export default function EmbedForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const formId = searchParams.get("formId");
  return (
    <div className="embedded-form-wrapper">
      <div className="content center">
        CONTENT
      </div>
      <div className="embedded-form">
        <div className="center">FORM</div>
        <iframe
          src={`http://localhost:3000/form/${formId}`}
          style={{width:"100%", height:"500px"}}
          title="Iframe Example"
        ></iframe>
      </div>
    </div>
  );
}
