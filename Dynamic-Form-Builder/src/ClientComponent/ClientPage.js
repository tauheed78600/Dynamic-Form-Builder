import React, { useEffect, useState } from 'react';
import './ClientPage.css';
import { useParams } from 'react-router-dom';
import { addClients, editClient, fetchClients, deleteClient12 } from '../APICalls/ClientAPIs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog.tsx';
import { Edit, MenuIcon, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [addClient, showAddClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedClientName, setEditedClientName] = useState('');
  const [deleteClientModal, showDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [sidebar, showSidebar] = useState(false)

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClients(params.id);
        console.log('Response of fetchData:', response.data);
        setClients(response.data);
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddClient = () => {
    const addClient = async () => {
      try {
        const res = await addClients(params.id, clientName);
        console.log('Response of addClient:', res.data);
        if (res.status === 200) {
          setClients((prevClients) => [...prevClients, { clientName }]);
          showAddClient(false);
        }
      } catch (error) {
        console.error('Error in addClient:', error);
      }
    };
    addClient();
  };

  const handleChange = (e) => {
    setClientName(e.target.value);
  };

  const handleEditChange = (e) => {
    setEditedClientName(e.target.value);
  };

  const saveEditedClient = async (id) => {
    try {
      const res = await editClient(id, editedClientName);
      console.log("res line 66", res);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === id ? { ...client, clientName: res.data.client.clientName } : client
        )
      );
      setEditIndex(null);
    } catch (error) {
      console.error('Error in saveEditedClient:', error);
    }
  };

  const handleClientClick = (id) => {
    if (editIndex === null) {
      navigate(`forms/${id}`);
    }
  };

  const handleDeleteClient = async () => {
    try {
      const res = await deleteClient12(clientToDelete);
      console.log("Delete response1234:", res);
      if (res.status === 200) {
        setClients((prevClients) => prevClients.filter((client) => client._id !== clientToDelete));
        showDeleteModal(false);
        setClientToDelete(null);
      }
    } catch (error) {
      console.error('Error in handleDeleteClient:', error);
    }
  };

  const confirmDeleteClient = (id) => {
    setClientToDelete(id);
    showDeleteModal(true);
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
        <h1 className='text-center'>Clients</h1>
      </div>
      <hr className='mt-4' />
      <main>
        <ul className="client-list">
          <div className='flex justify-end'>
            <button onClick={() => showAddClient(true)} className="new-client-button">
              + New Client
            </button>
          </div>
          {clients.map((client, index) => (
            <li key={index} className="client-item">
              <div
                onClick={() => handleClientClick(client._id)}
                className="client-item-content mt-6"
                style={{ cursor: editIndex === index ? 'not-allowed' : 'pointer' }}
              >
                <span className="bullet">•</span>
                {editIndex === index ? (
                  <div className="flex flex-row gap-2">
                    <input
                      value={editedClientName}
                      onChange={handleEditChange}
                      className="border border-black"
                    />
                    <button
                      onClick={() => saveEditedClient(client._id)}
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
                  <span>{client.clientName}</span>
                )}
              </div>
              <div className="client-item-actions">
                <button
                  onClick={() => {
                    setEditIndex(index);
                    setEditedClientName(client.clientName);
                  }}
                  className="icon-button"
                  aria-label="Edit client"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => confirmDeleteClient(client._id)}
                  className="icon-button"
                  aria-label="Delete client"
                >
                  <Trash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      {addClient && (
        <Dialog open={addClient} onOpenChange={showAddClient}>
          <DialogContent className="h-[200px]">
            <DialogHeader>
              <DialogTitle>
                <span className="text-xl">Add New Client</span>
              </DialogTitle>
              <DialogDescription>
                <span className="mt-20 text-lg">
                  <div className="flex flex-row gap-2">
                    <label className=''>Enter Client Name</label>
                    <input
                      onChange={handleChange}
                      className="border border-black h-[35px] p-2 text-sm"
                    ></input>
                  </div>
                  <button
                    onClick={handleAddClient}
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

      {deleteClientModal && (
        <Dialog open={deleteClientModal} onOpenChange={showDeleteModal}>
          <DialogContent className="h-[200px]">
            <DialogHeader>
              <DialogTitle>
                <span className="text-xl">Are you sure you want to delete this client?</span>
              </DialogTitle>
              <DialogDescription>
                <div className="text-white flex flex-row gap-4 mt-9 justify-center">
                  <button
                    onClick={handleDeleteClient}
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

export default ClientList;
