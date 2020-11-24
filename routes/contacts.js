const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const User = require("../models/User");
const Contact = require("../models/Contacts");

//@route   GET api/contacts
//@desc    get all users contacts
//@access  Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

//@route   POST api/contacts
//@desc    add contacts
//@access  Private
router.post(
  "/",
  [auth, [check("name", "name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  }
);

//@route   PUT api/contacts/:id
//@desc    Update contacts
//@access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "contact not found" });

    //Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authroized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

//@route   DELETE api/contacts/:id
//@desc    delete contacts
//@access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "contact not found" });

    //Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authroized" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

module.exports = router;
