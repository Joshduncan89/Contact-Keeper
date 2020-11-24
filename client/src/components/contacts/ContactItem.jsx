import React, { useContext } from "react";
import ContactContext from "../../context/contact/ContactContext";

const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);

  const { deleteContact, setCurrent, clearCurrent } = contactContext;

  const { id, name, email, phone, type } = contact;

  const onDelete = () => {
    deleteContact(id);
    clearCurrent();
  };

  // const setCurrentContact = () => {
  //   setCurrent(contact)
  // }

  return (
    <div className='card bg-light'>
      <h3 className='text-primary text-left'>
        {name}
        {""}
        <span
          style={{ float: "right" }}
          className={
            "badge " + (type === "personal" ? "badge-success" : "badge-primary")
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className='list'>
        {email && (
          <li>
            <i className='fa fa-envelope-open'></i>
            {email}
          </li>
        )}
        {phone && (
          <li>
            <i className='fa fa-phone'></i>
            {phone}
          </li>
        )}
      </ul>
      <p>
        <button
          className='btn btn-sm btn-dark'
          onClick={() => setCurrent(contact)}
        >
          Edit
        </button>
        <button className='btn btn-sm btn-danger' onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  );
};

export default ContactItem;
