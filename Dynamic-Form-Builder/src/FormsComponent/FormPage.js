import React, { useEffect, useState } from 'react';
import './FormPage.css';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchFormData } from '../APICalls/FormAPIs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog.tsx';
import { Edit, Menu, MenuIcon, Trash2 } from 'lucide-react';
import { addForms } from '../APICalls/FormAPIs';
import { deleteForm } from '../APICalls/ClientAPIs';
import { editForm } from '../APICalls/ClientAPIs';
import { useNavigate } from 'react-router-dom';
import { fetchClients } from '../APICalls/ClientAPIs';

const FormPage = () => {
  const [client, setClient] = useSearchParams();
  const clientName = client.get('client');
  const [forms, setForms] = useState([])
  const [addForm, showAddForm] = useState(false)
  const [formName, setFormName] = useState('')

  const params = useParams()
  console.log("params in line 11 forms", params.id)

  useEffect(()=>{
    const fetchForms = async() =>{
      try{
        const res = await fetchFormData(formId)
        console.log("response line 18 forms", res.data)
        setForms(res.data)
      }catch(error){
        console.error('Error in fetchForms:', error);
      }
    }
    fetchForms()
  }, [formId])

  const handleChange = (e) => {
    setFormName(e.target.value);
  };

  const handleDeleteForm = async () => {
    console.log("line 46 id", formToDelete)
    try {
      const res = await deleteForm(formToDelete);
      if (res.status === 200) {
        setForms((prevForms) => prevForms.filter((form) => form._id !== formToDelete));
        showDeleteModal(false);
        setFormToDelete(null);
      }
    } catch (error) {
      console.error('Error in handleDeleteForm:', error);
    }
  };

  const handleAddForm = () =>{
    const addForm = async () => {
      console.log("inside add form line 89", clientId)
      try {
        const res = await addForms(formId, formName)
        console.log('Response of addForm:', res);
        if (res.status === 200) {
          setForms(prevForms => [...prevForms, { formName }]);
          showAddForm(false)
        }
      } catch (error) {
        console.error('Error in addForm:', error);
      }
    }
    addForm()
  }

  const handleEditChange = (e) => {
    setEditedFormName(e.target.value);
  };

  const saveEditedForm = async (id) => {
    try {
      const res = await editForm(id, editedFormName);
      console.log("res line 66", res);
      setForms((prevForms) =>
        prevForms.map((form) =>
          form._id === id ? { ...form, formName: res.data.form.formName } : form
        )
      );
      setEditIndex(null);
    } catch (error) {
      console.error('Error in saveEditedForm:', error);
    }
  };

  const confirmDeleteForm = (id) => {
    console.log("id in conform", id)
    setFormToDelete(id);
    showDeleteModal(true);
  };

  const handleFormClick = (id) => {
    // if (editIndex === null) {
    //   navigate(`forms/${id}`);
    // }
  };

  const handleLogout = () =>{
    localStorage.removeItem('token')
    localStorage.removeItem('userid')
    localStorage.removeItem('formToken')
    navigate('/login')
  }

  return (
    <div className="container">
      <div className="flex justify-between">
        <div className="">
          <MenuIcon className='h-10 w-10' onClick={() => showSidebar(true)} />
        </div>
        <div
          className={`fixed h-full bg-white left-0 top-0 w-[25%] border border-gray-600 shadow-2xl transform ${sidebar ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-500 ease-in-out z-10`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <div>

              <h2 className='text-3xl font-extrabold'>Clients List</h2>
            </div>
            <span
              onClick={() => showSidebar(false)}
              className="h-6 w-6 cursor-pointer"
            >X</span>
          </div>
          <div className="p-4">
            {clients.map((client, index) => (
              <li key={index} className="client-item">
                <div
                  onClick={() => handleClientClick(client._id)}
                  className="client-item-content"
                  style={{ cursor: editIndex === index ? 'not-allowed' : 'pointer' }}
                >
                  <span className="bullet">•</span>
                  
                    <span>{client.clientName}</span>
                </div>
              </li>
            ))}
          </div>
        </div>
        <div>
          <h1 className='text-center text-6xl text-blue-600'>Dynamic Form Builder</h1>
          
        </div>
        <div>
          <button onClick={handleLogout} className='bg-red-600 text-white text-xl rounded-xl h-12 w-24'>Logout</button>
        </div>
      </div>
      <div className=''>
        <h1 className='text-center'>Forms</h1>
      </div>
      <hr className='mt-5'/>
      <main className="main-content">
        <ul className="form-list">
          {forms.map((form, index) => (
            <li key={index} className="form-item" onClick={()=>{
              navigate(`/form-builder/?clientId=${params.id}&formId=${form._id}`);
            }}>
              <div className="form-item-content">
                <span className="bullet">•</span>
                {editIndex === index ? (
                  <div className="flex flex-row gap-2">
                    <input
                      value={editedFormName}
                      onChange={handleEditChange}
                      className="border border-black"
                    />
                    <button
                      onClick={() => saveEditedForm(form._id)}
                      className="border bg-blue-600 rounded-lg h-10 w-24 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="border bg-red-600 rounded-lg h-10 w-24 text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span>{form.formName}</span>
                )}
              </div>
              <div className="form-item-actions">
              <button
                  onClick={() => {
                    setEditIndex(index);
                    setEditedFormName(form.formName);
                  }}
                  className="icon-button"
                  aria-label="Edit client"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => confirmDeleteForm(form._id)}
                  className="icon-button"
                  aria-label="Delete client"
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      {addForm && <>
        <Dialog open={addForm} onOpenChange={showAddForm}>
          <DialogContent className="h-[200px]">
            <DialogHeader>
              <DialogTitle>
                <span className="text-xl">Add New Form</span>
              </DialogTitle>
              <DialogDescription>
                <span className="mt-20 text-lg">
                  <div className='flex flex-row gap-2'>
                    <label>Enter Form Name</label>
                    <input onChange={handleChange} className='border border-black h-[35px]'></input>
                  </div>
                  <button onClick={handleAddForm} className='border border-blue-400 bg-blue-400 mt-4 h-[50px] w-[140px] rounded-lg text-white'>Add New Form</button>
                </span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>}

      {deleteFormModal && (
        <Dialog open={deleteFormModal} onOpenChange={showDeleteModal}>
          <DialogContent className="h-[200px]">
            <DialogHeader>
              <DialogTitle>
                <div className='flex flex-col'>
                <span className="text-xl">Are you sure you want to delete this Form?</span>
                <span className='text-gray-500 text-sm'>This will delete all the data related to the form</span>
                </div>
              </DialogTitle>
              <DialogDescription>
                <div className="text-white flex flex-row gap-4 mt-9 justify-center">
                  <button
                    onClick={handleDeleteForm}
                    className="bg-red-600 h-10 w-24"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => showDeleteModal(false)}
                    className="bg-blue-600 h-10 w-24"
                  >
                    Cancel
                  </button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FormPage;