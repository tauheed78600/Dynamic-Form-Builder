import "./App.css";
import DynamicFormBuilder from "./DynamicFormBuilder";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EmbedForm from "./EmbedForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DynamicFormBuilder />,
  },
  {
    path: "/embed",
    element: <EmbedForm />,
  },
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;
