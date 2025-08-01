import React from "react";

const ContactList = ({ contacts, onUpdate, onDelete }) => {
    const handleDelete = async (id) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this contact?"
        );
        if (shouldDelete) {
            const response = await fetch(
                `http://127.0.0.1:5000/delete_contact/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (response.status === 200) {
                onDelete();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        }
    };

    return (
        <div>
            <h2>Contacts</h2>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact._id}>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>
                                <button onClick={() => onUpdate(contact)}>
                                    Update
                                </button>
                                <button onClick={() => handleDelete(contact._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;