import React, { use, useEffect, useState } from 'react';
import './ClientPage.css';
import { useParams } from 'react-router-dom';
import { addClients, fetchClients } from '../APICalls/ClientAPIs';
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
  const [clients, setClients] = useState([])
  const [addClient, showAddClient] = useState(false)
  const [clientName, setClientName] = useState('')

  const params = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClients(params.id);
        console.log('Response of fetchData:', response.data);
        setClients(response.data)
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddClient = () => {
    const addClient = async () => {
      try {
        const res = await addClients(params.id, clientName)
        console.log('Response of addClient:', res.data);
        if (res.status === 200) {
          setClients(prevClients => [...prevClients, { clientName }]);
          showAddClient(false)
        }
      } catch (error) {
        console.error('Error in addClient:', error);
      }
    }
    addClient()
  }

  const handleChange = (e) => {
    setClientName(e.target.value);
  };

  const handleFormNav = () =>{

  }


  return (
    <div className="container">
      <div className='divHeader'>
        <div className="menu-icon">☰</div>
        <h1>CLIENTS</h1>
        <button onClick={() => showAddClient(true)} className="new-client-button">+ New Client</button>
      </div>
      <main>
        <ul className="client-list">
          {clients.map((client, index) => (
            <li key={index} className="client-item">
              <div onClick={()=>navigate(`forms/${client._id}`)} className="client-item-content">
                <span className="bullet">•</span>
                <span>{client.clientName}</span>
              </div>
              <div className="client-item-actions">
                <button className="icon-button" aria-label="Edit client">
                  <Edit />
                </button>
                <button className="icon-button" aria-label="Delete client">
                  <Trash />
                </button>
              </div>
            </li>
          ))}
        </ul>

      </main>
      {addClient && <>
        <Dialog open={addClient} onOpenChange={showAddClient}>
          <DialogContent className="h-[200px]">
            <DialogHeader>
              <DialogTitle>
                <span className="text-xl">Add New Client</span>
              </DialogTitle>
              <DialogDescription>
                <span className="mt-20 text-lg">
                  <div className='flex flex-row gap-2'>
                    <label>Enter Client Name</label>
                    <input onChange={handleChange} className='border border-black h-[35px]'></input>
                  </div>
                  <button onClick={handleAddClient} className='border border-blue-400 bg-blue-400 mt-4 h-[50px] w-[140px] rounded-lg text-white'>Add Client</button>
                </span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>}
    </div>
  );
};
export default ClientList;