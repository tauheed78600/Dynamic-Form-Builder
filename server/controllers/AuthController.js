import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { createToken } from "../utils/TokenManager.js";
import Client from "../models/Clients.js";
import Form from "../models/Forms.js";
import FormData from "../models/FormData.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const fetchClients = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("req id", id);

        const clients = await Client.find({ user_id: id });
        console.log("fetched clients", clients)
        return res.status(200).json(clients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const addFormData = async (req, res, next) => {
    const { id } = req.params;
    const { formLayout } = req.body;

    try {
        const form = await Form.findById(id);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        form.formLayout = formLayout;

        console.log("Form before save:", form);

        const updatedForm = await form.save();

        console.log("Form after save:", updatedForm);
        res.status(200).json({ message: "Added Form Layout", form });
    } catch (error) {
        console.error("Error in adding form layout:", error);
        return res.status(500).json({
            message: "Error Adding Form layout",
            error: error.message
        });
    }
};

export const saveFormData = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("inside saveFormData", req.body);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'formId is required',
            });
        }

        const document = new FormData({
            formId: id,
            ...req.body,
        });

        const savedDocument = await document.save();

        return res.status(200).json({
            message: 'Form Details Successfully Saved',
            data: savedDocument,
        });
    } catch (error) {
        console.error('Error in saveFormData:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const getFormDetails = async (req, res, next) => {
    try{
        const { id } = req.params
        console.log("inside getFormDetails", id)
        const res1 = await FormData.find({formId:id})
        console.log("res line 92", res1)
        return res.status(200).json({
            message: "Form Details Fetched",
            data: res1
        })
    }catch(error){
        console.error('Error in getFormDetails:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}

export const getFormHTML = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log("inside getFormHTML", id)
        const form = await Form.findById(id)
        console.log("form line 59", form.formLayout)
        if (!form) {
            console.log("inside form not found")
            return res.status(404).json({ message: 'Form not Found' });
        }
        return res.send(`
        <html>
          <head>
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            />
            <link
              rel="stylesheet"
              href="https://cdn.form.io/formiojs/formio.full.min.css"
            />
          </head>
          <body>
            <div id="formio"></div>
            <script src="https://cdn.form.io/formiojs/formio.full.min.js"></script>
            <script>
              Formio.createForm(document.getElementById('formio'), {
                    components: ${JSON.stringify(form.formLayout)}
                    }).then(function(formInstance) {
                    let messageContainers = document.querySelectorAll('[ref="buttonMessageContainer"]');
                    messageContainers.forEach(container => {
                        container.style.display = 'none';
                    });
                    formInstance.on('submit', function(submission) {
                        const submissionData = submission.data;
                        console.log(submissionData);
                        fetch('http://localhost:3125/api/auth/saveFormData/${id}', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(submissionData)
                        }).then(response => {
                        formInstance.emit('submitDone', submission);
                        if (response.status !== 200) {
                            alert('Could not submit data');
                            console.log('Could not submit data');
                        } else {
                            alert('Submitted data');
                        }
                        return response.json();
                        }).then(message => console.log(message))
                    });
                    }).catch(error => {
                    console.error('Form initialization error:', error);
                    });
            </script>
          </body>
        </html>
            `);

    } catch (error) {
        console.error('Error getting Form HTML:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const getFormData = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log("inside getFormData876543", id)
        const form = await Form.findById(id)
        if (!form) {
            return res.status(404).json({ message: 'Form not Found' });
        }
        return res.status(200).json({
            message: "Form Details",
            formLayout: form.formLayout,
            formName: form.formName
        })
    } catch (error) {
        console.error('Error getting form:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const editForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { formName } = req.body;

        if (!id || !formName) {
            return res.status(400).json({ message: 'Form ID and Form Name are required' });
        }

        console.log('Request received:', { id, formName });


        const updatedForm = await Form.findByIdAndUpdate(
            id,
            { formName },
            { new: true, runValidators: true }
        );

        console.log("updated form line 55", updatedForm)
        return res.status(200).json({
            message: 'Form updated successfully',
            form: updatedForm,
        });
    } catch (error) {
        console.error('Error updating client:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const deleteForm = async (req, res, next) => {
    try {

        const { id } = req.params;
        console.log("inside deleteForm", id)
        const result = await Form.deleteOne({ _id: id });


        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }

        return res.status(200).json({ message: 'Form Deleted Successfully' });
    } catch (error) {
        console.error("Error in deleteForm:", error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

export const deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await Client.deleteOne({ _id: id });

        await Form.deleteMany({ clientId: id })

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }

        return res.status(200).json({ message: 'Deleted Successfully' });
    } catch (error) {
        console.error("Error in deleteClient:", error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};



export const editClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { clientName } = req.body;

        if (!id || !clientName) {
            return res.status(400).json({ message: 'Client ID and Client Name are required' });
        }

        console.log('Request received:', { id, clientName });


        const updatedForm = await Client.findByIdAndUpdate(
            id,
            { clientName },
            { new: true, runValidators: true }
        );

        console.log("updated client line 55", updatedForm)
        return res.status(200).json({
            message: 'Client updated successfully',
            client: updatedForm,
        });
    } catch (error) {
        console.error('Error updating client:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const getForms = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("req id", id);

        const forms = await Form.find({ clientId: id });
        console.log("fetched forms", forms)
        return res.status(200).json(forms);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const addForms = async (req, res, next) => {
    try {
        console.log("inside add forms")
        const { id } = req.params
        const { formName } = req.body
        console.log("inside add form API", id, formName)
        const form = new Form({ formName: formName, clientId: id })
        await form.save()
        res.status(200).json({ message: "New Form Created", data: form })
    } catch (error) {
        console.log("error in adding form", error)
        return res.status(500).json({ message: "Error Adding Form", error: error.message });
    }
}

export const addClient = async (req, res, next) => {
    try {
        const { id } = req.params
        const { clientName } = req.body
        console.log("inside add API", id, clientName)
        const client = new Client({ clientName: clientName, user_id: id })
        await client.save();
        return res.status(200).json({ message: "Client Added Successfully", data:client })
    } catch (error) {
        return res.status(500).json({ message: "Error Adding clients", error: error.message });
    }

}

export const getAllUsers = async (req, res, next) => {
    try {
        const user = await User.findOne();
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        const client = new Client({ clientName: "Client B", user_id: user._id });
        await client.save();

        console.log("Client saved successfully");

        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

export const googleSignin = async (req, res, next) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name, avatar: picture, googleId });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token: jwtToken, user });
    } catch (error) {
        res.status(400).json({ message: "Invalid Google Token" });
    }
}

export const signin = async (req, res, next) => {
    try {
        const { form } = req.body;
        console.log("form in line 52", form)
        const email = form.email;
        const password = form.password;

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(401).send("User not registered");
        }
        console.log("checkUser line 60", checkUser)
        const checkPassword = await bcrypt.compare(password, checkUser.password);

        if (!checkPassword) {
            return res.status(400).send("Password is incorrect");
        }


        const token = createToken(checkUser._id.toString(), checkUser.email, "7d");

        return res.status(200).json({
            message: "OK",
            name: checkUser.name,
            email: checkUser.email,
            token: token,
            id: checkUser.id
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

export const signup = async (req, res, next) => {
    try {
        const { form } = req.body;

        const name = form.name;
        const email = form.email;
        const password = form.password;

        const isExisting = await User.findOne({ email });

        if (isExisting) {
            return res.status(400).json({ message: "User with this email ID already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user1 = new User({ name, email, password: hashedPassword });

        await user1.save();

        const token = createToken(user1._id.toString(), user1.email, "7d");

        return res.status(201).json({
            message: "OK",
            name: user1.name,
            email: user1.email,
        });
    } catch (error) {
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};