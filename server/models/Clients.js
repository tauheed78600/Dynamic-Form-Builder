import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Client = mongoose.model("Client", clientSchema);
export default Client;