import "./App.css";
import DynamicFormBuilder from "./Builder/DynamicFormBuilder";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import EmbedForm from "./EmbedForm";
import Login from "./AuthComponent/Login";
import Register from "./AuthComponent/Register";
import ClientList from "./ClientComponent/ClientPage";
import FormPage from "./FormsComponent/FormPage";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={`/clients/${localStorage.getItem("userid")}`} />; 
  } else {
    return <Login/>;
  }
};

const router = createBrowserRouter([
  {
    path: "/clients/:id",
    element: (
      <ProtectedRoute element={<ClientList />} />
    ),
  },
  {
    path: "clients/:clientId/forms/:formId",
    element: (
      <ProtectedRoute element={<FormPage />} />
    ),
  },
  {
    path: "/login",
    element: isLoggedIn(),
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/form-builder",
    element: (
      <ProtectedRoute element={<DynamicFormBuilder />} />
    ),
  },
  {
    path: "/embed",
    element: (
      <ProtectedRoute element={<EmbedForm />} />
    ),
  },
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;
