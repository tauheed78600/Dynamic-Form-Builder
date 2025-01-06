import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
  },
  { strict: false }
);

const Form = mongoose.model('Form', formSchema);

export default Form;
