import React, {useState} from 'react'
import { MenuIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function Header({clients, forms}) {

    const [sidebar, showSidebar] = useState(false)
    const [editIndex, setEditIndex] = useState(null);


    const navigate = useNavigate()

    const handleClientClick = (id) => {
        if (editIndex === null) {
            navigate(`forms/${id}`);
        }
    };

    const handleLogout = () =>{
        localStorage.removeItem('token')
        localStorage.removeItem('userid')
        localStorage.removeItem('formToken')
        navigate('/login')
      }


    return (
        <div>
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
        </div>
    )
}

export default Header
