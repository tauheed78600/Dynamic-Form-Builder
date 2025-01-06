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
import { Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [addClient, showAddClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedClientName, setEditedClientName] = useState('');
  const [deleteClientModal, showDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

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
      setEditIndex(false);
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
      console.log("Delete response:", res);
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

  return (
    <div className="container">
      <div className="divHeader">
        <div className="menu-icon">☰</div>
        <h1>CLIENTS</h1>
        <button onClick={() => showAddClient(true)} className="new-client-button">
          + New Client
        </button>
      </div>
      <main>
        <ul className="client-list">
          {clients.map((client, index) => (
            <li key={index} className="client-item">
              <div
                onClick={() => handleClientClick(client._id)}
                className="client-item-content"
                style={{ cursor: editIndex === index ? 'not-allowed' : 'pointer' }}
              >
                <span className="bullet">•</span>
                {editIndex === index ? (
                  <div className="flex flex-row gap-4">
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
                    <label>Enter Client Name</label>
                    <input
                      onChange={handleChange}
                      className="border border-black h-[35px]"
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
                    Yes
                  </button>
                  <button
                    onClick={() => showDeleteModal(false)}
                    className="bg-blue-600 h-10 w-24"
                  >
                    No
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
