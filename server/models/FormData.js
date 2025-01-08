import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
{
    formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
}, { strict: false });

const FormData = mongoose.model('FormData', formSchema);

export default FormData;
