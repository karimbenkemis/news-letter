const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone_number: String,
  shouldAddToNewsletter: {
    type: Boolean,
    default: false
  },
  created_at: { type: Date }
  });

module.exports = mongoose.model('contacts', ContactSchema);
