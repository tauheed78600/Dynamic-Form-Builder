import React, { useEffect, useState } from 'react';
import './FormPage.css';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchFormData } from '../APICalls/FormAPIs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog.tsx';

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
        const res = await fetchFormData(params.id)
        console.log("response line 18 forms", res.data)
        setForms(res.data)
      }catch(error){
        console.error('Error in fetchForms:', error);
      }
    }
    fetchForms()
  }, [])

  const handleChange = (e) => {
    setFormName(e.target.value);
  };

  const handleAddForm = () =>{
    const addForm = async () => {
      try {
        const res = await addForm(params.id, formName)
        console.log('Response of addClient:', res.data);
        if (res.status === 200) {
          setForms(prevForms => [...prevForms, { formName }]);
          showAddForm(false)
        }
      } catch (error) {
        console.error('Error in addClient:', error);
      }
    }
    addForm()
  }

  return (
    <div className="container">
      <div className='divHeader'>
        <div className="menu-icon">☰</div>
        <h1>{clientName}</h1>
        <button onClick={()=>{showAddForm(true)}} className="new-form-button">
          <span>+</span> New Form
        </button>
      </div>
      <main className="main-content">
        <ul className="form-list">
          {forms.map((form, index) => (
            <li key={index} className="form-item">
              <div className="form-item-content">
                <span className="bullet">•</span>
                <span>{form}</span>
              </div>
              <div className="form-item-actions">
                <button
                  className="icon-button"
                  aria-label="Edit form"
                >
                  <img src="/edit.png" alt="Edit" className="action-icon" />
                </button>
                <button
                  className="icon-button"
                  aria-label="Delete form"
                >
                  <img src="/del.png" alt="Delete" className="action-icon" />
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
    </div>
  );
};

export default FormPage;