import axios from "axios"

export const fetchClients = async(id) =>{
    console.log("id in line 4", id)
    const res = await axios.post(`http://localhost:3125/api/auth/fetchClients/${id}`)
    console.log("res in line 6", res)
    return res
}

export const fetchFormDetails = async(id)=>{
  const res = await axios.get(`http://localhost:3125/api/auth/form-details/${id}`)
  return res
}

export const getFormData = async(id)=>{
  console.log("id getForm", id)
  const res = await axios.get(`http://localhost:3125/api/auth/getFormData/${id}`)
  return res
}

export const addFormData = async(id, formLayout)=>{
  const res = await axios.put(`http://localhost:3125/api/auth/addFormData/${id}`,{
    formLayout
  })
  return res
}

export const editClient = async(id, clientName) =>{
  const res = await axios.put(`http://localhost:3125/api/auth/editClient/${id}`,{
    clientName
  })
  return res
}

export const editForm = async (id, formName) => {
  const res = await axios.put(`http://localhost:3125/api/auth/editForm/${id}`,{
    formName
  })
  return res
}

export const deleteForm = async(id) =>{
  const res = await axios.delete(`http://localhost:3125/api/auth/deleteForm/${id}`)
  return res
}

export const deleteClient12 = async (id) => {
  const res = await axios.delete(`http://localhost:3125/api/auth/deleteClient/${id}`)
  return res
}

export const addClients = async (id, clientName) => {
    console.log("id, clientName", id, clientName)
    try {
      const res = await axios.post(`http://localhost:3125/api/auth/addClient/${id}`, {
        clientName,
      });
  
      console.log("Response from addClients:", res.data);
      return res;
    } catch (error) {
      console.error("Error in addClients:", error);
      throw error;
    }
  };
  