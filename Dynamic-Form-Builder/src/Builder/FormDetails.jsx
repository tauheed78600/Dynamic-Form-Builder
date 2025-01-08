import React, { useEffect, useState } from 'react'
import { fetchFormDetails } from '../APICalls/ClientAPIs'
import { useParams } from 'react-router-dom'

function FormDetails({userid}) {
    const [formDetails, setFormDetails] = useState([])
    const {formId, clientId} = useParams()
    console.log("line 8 formId clientId", formId, clientId)

    useEffect(()=>{
       const fetchForm = async()=>{
        const res = await fetchFormDetails(userid)
        console.log("res line 10", res)
       }
       fetchForm()
    }, [])

  return (
    <div>
      
    </div>
  )
}

export default FormDetails
