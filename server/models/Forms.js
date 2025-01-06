import mongoose from "mongoose";

const formSchema = new mongoose.Schema({}, { strict: false });

const Form = mongoose.model('Form', formSchema);