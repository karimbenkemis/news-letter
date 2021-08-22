const express     = require('express');
const router      = express.Router();
const Contact     = require('../model/contact');
const distantAPI  = require('../sdk/SMS-SDK');

// Get all contacts, GET '/'
router.get('/', async (req, res) => {
  let sortObj = {};

  //Sort contacts with query sort_by when it exists
  if(req.query.sort_by) {
    switch (req.query.sort_by) {
      case 'date':
        sortObj = {date: 'ascending'};
        break;
      case 'email':
          sortObj = {email: 'ascending'}
        break;
      default:
        sortObj = {date: 'ascending'};
    }
  }

  const contacts = await Contact.find().sort(sortObj);

  res.render('index', {
    contacts
  });
});


// Add new contact, POST '/add'
router.post('/add', async (req, res, next) => {
  const contact = new Contact(req.body);
  contact.created_at = Date.now();

  if(contact.shouldAddToNewsletter) {
    console.log(JSON.stringify(contact));
  }

  await contact.save();
  res.redirect('/');
});

// Get contact edit form
router.get('/edit/:id', async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  res.render('edit', { contact });
});

// Edit contact, POST '/edit/:id'
// @todo add edition of contact using email instead of db id
router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;

  if(req.body.shouldAddToNewsletter) {
    console.log(JSON.stringify(req.params));
  }

  await Contact.update({_id: id}, req.body);
  res.redirect('/');
});

// Delete contact, DELTE '/edit/:id'
router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Contact.remove({_id: id});
  res.redirect('/');
});

router.get('/sendSms', async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    const contactsPhones = contacts.map(contact => {return contact.phone_number});
    let message = `Hi `;
    //@Todo add authorization header to verify client authen
    let clientToken = "abced123";
    let messages = await distantAPI.sendSMS(contactsPhones, message, clientToken);

    res.render('smsSended', { messages });
  } catch (e) {
    console.log("unexpected sms eror: " + JSON.stringify(e));
  }
  
});

module.exports = router;
