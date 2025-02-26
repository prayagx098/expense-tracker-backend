const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  fkUserLoginId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
},
{ collection: "chat" });

module.exports = mongoose.model('Chat', chatSchema);
