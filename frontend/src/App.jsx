import { useState, useEffect } from 'react'
import ContactList from './ContactList'
import ContactForm from './ContactForm'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([])
  const [currentContact, setCurrentContact] = useState({})

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts")
    const data = await response.json()
    setContacts(data.contacts)
    console.log(data.contacts)
  }

  const closeModal = () => {
    setCurrentContact({})
  }

  const openEditModal = (contact) => {
    setCurrentContact(contact)
  }

  const onUpdate = () => {
    fetchContacts()
    closeModal()
  }

  return (
    <>
      <ContactList contacts={contacts} onUpdate={openEditModal} onDelete={fetchContacts} />
      {currentContact.email ? (
        <div>
          <button onClick={closeModal}>Close</button>
          <ContactForm existingContact={currentContact} onUpdate={onUpdate} />
        </div>
      ) : (
        <ContactForm onUpdate={fetchContacts} />
      )}
    </>
  );
}

export default App;