import axios from "axios"

export const fetchFormData = async(id) =>{
    const res = await axios.get(`http://localhost:3125/api/auth/getForms/${id}`)
}

export const addForm = async (id, formName) => {
    const res = await axios.get(`http://localhost:3125/api/auth/addForm/${id}`,{
        formName
    })
}