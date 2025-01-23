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
import { Edit, Menu, MenuIcon, Trash2, MoveLeft, MoveRightIcon } from 'lucide-react';
import { addForms } from '../APICalls/FormAPIs';
import { deleteForm } from '../APICalls/ClientAPIs';
import { editForm } from '../APICalls/ClientAPIs';
import { fetchClients } from '../APICalls/ClientAPIs';
import ReactPaginate from 'react-paginate';

const FormPage = () => {
  const [clients, setClients] = useState([]);
  // const clientName = client.get('client');
  const [forms, setForms] = useState([])
  const [addForm, showAddForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [deleteFormModal, showDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editedFormName, setEditedFormName] = useState('');
  const [sidebar, showSidebar] = useState(false)
  const [logout, showLogout] = useState(false)
  const [currentPage, setCurrentPage] = useState(0);
  const clientsPerPage = 5;

  const { clientId, formId } = useParams()

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClients(clientId);
        console.log('Response of fetchData:', response.data);
        setClients(response.data);
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, []);

  const handleClientClick = (formId) => {
    if (editIndex === null) {
      navigate(`/clients/${clientId}/forms/${formId}`);
      showSidebar(false)
    }
  };


  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetchFormData(formId)
        console.log("response line 18 forms", res.data)
        setForms(res.data)
      } catch (error) {
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

  const handleAddForm = () => {
    const addForm = async () => {
      console.log("inside add form line 89", clientId)
      try {
        const res = await addForms(formId, formName)
        console.log('Response of addForm:', res);
        if (res.status === 200) {
          setForms(prevForms => [...prevForms, { formName }]);
          showAddForm(false)
          navigate(`/form-builder/?clientId=${clientId}&formId=${res.data.data._id}`)
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userid')
    window.location.href = '/login'
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const displayedClients = forms.slice(currentPage * clientsPerPage, (currentPage + 1) * clientsPerPage);


  return (
    <div className="container">
      <div className="flex justify-between">
        <div className="">
          <MenuIcon className='h-10 w-10' onClick={() => showSidebar(true)} />
        </div>
        <div
          className={`fixed h-full bg-white left-0 top-0 lg:w-[25%] border border-gray-600 shadow-2xl transform ${sidebar ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-500 ease-in-out z-10 overflow-y-auto scoll-smooth scrollbar-hidden`}
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
              <li key={index} className="client-item-side">
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
          <button onClick={handleLogout} className='bg-red-600 text-white lg:text-xl text-sm lg:rounded-xl lg:h-12 lg:w-24 w-20 h-12'>Logout</button>

        </div>

      </div>
      <div className=''>
        <div>
          <h1 className='text-center lg:text-6xl text-2xl text-blue-600'>Dynamic Form Builder</h1>
        </div>
        <h1 className='text-center'>Forms</h1>
      </div>
      <hr className='mt-5' />
      <main className="main-content">
        <ul className="form-list">
          <div className='flex justify-end'>
            <button onClick={() => showAddForm(true)} className="new-client-button">
              + New Form
            </button>
          </div>
          {displayedClients.map((form, index) => (
            <li key={index} className="form-item">
              <div
                className="form-item-content mt-6"
                style={{ cursor: editIndex === index ? 'not-allowed' : 'pointer' }}
              >
                <span className="bullet">•</span>
                {editIndex === index ? (
                  <div className="flex flex-row gap-2">
                    <input
                      value={editedFormName}
                      onChange={handleEditChange}
                      className="border border-black lg:w-auto w-[110px]"
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
                  <div onClick={() => navigate(`/form-builder/?clientId=${form.clientId}&formId=${form._id}`)}>
                    <span>{form.formName}</span>
                  </div>
                )}
              </div>

              {editIndex !== index && (
                <div className="form-item-actions">
                  <button
                    onClick={() => {
                      setEditIndex(index);
                      setEditedFormName(form.formName);
                    }}
                    className="icon-button"
                    aria-label="Edit form"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => confirmDeleteForm(form._id)}
                    className="icon-button"
                    aria-label="Delete form"
                  >
                    <Trash2 />
                  </button>
                </div>
              )}
            </li>
          ))}



        </ul>
        <ReactPaginate
          previousLabel={currentPage !== 0 ? <MoveLeft /> : null}
          nextLabel={currentPage < Math.ceil(forms.length / clientsPerPage) - 1 ? <MoveRightIcon /> : null}
          breakLabel={"..."}
          pageCount={Math.ceil(forms.length / clientsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          className='flex justify-center gap-4'
        />
      </main>

      {addForm && (
        <>
          <Dialog open={addForm} onOpenChange={showAddForm}>
            <DialogContent className="h-auto">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-xl">Add New Form</span>
                </DialogTitle>
                <DialogDescription>
                  <span className='mt-20 text-lg'>
                    <div className='flex flex-col gap-2'>
                      <label>Enter Form Name</label>
                      <input onChange={handleChange} 
                      className='border border-black h-[40px] rounded-full p-4 text-sm' 
                      placeholder='Ex: Google'
                      />
                    </div>
                    <button onClick={handleAddForm} className='border border-blue-400 bg-blue-400 mt-4 h-[50px] w-[440px] rounded-full text-white'>Add New Form</button>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )}

      {logout && <>
        <Dialog open={logout} onOpenChange={showLogout}>
          <DialogContent className="h-auto">
            <DialogHeader>
              <DialogTitle>
                <span className="text-xl">Are you sure you want to Logout</span>
              </DialogTitle>
              <DialogDescription>
                <div className="text-white flex flex-row gap-4 mt-9 justify-center">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 h-10 w-24"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => showLogout(false)}
                    className="bg-blue-600 h-10 w-24"
                  >
                    No
                  </button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>}

      {deleteFormModal && (
        <Dialog open={deleteFormModal} onOpenChange={showDeleteModal}>
          <DialogContent className="h-auto">
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