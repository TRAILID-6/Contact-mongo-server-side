import { useState, useEffect } from "react"

const ContactForm = ({ existingContact = {}, onUpdate }) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (existingContact.email) {
            setFirstName(existingContact.firstName);
            setLastName(existingContact.lastName);
            setEmail(existingContact.email);
        }
    }, [existingContact]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            firstName,
            lastName,
            email,
        };

        const isUpdating = Object.keys(existingContact).length > 0;
        const url = isUpdating
            ? `http://127.0.0.1:5000/update_contact/${existingContact._id}`
            : "http://127.0.0.1:5000/create_contact";
        const options = {
            method: isUpdating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message);
        } else {
            onUpdate();
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>{Object.keys(existingContact).length > 0 ? "Update Contact" : "Create a New Contact"}</h2>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">{Object.keys(existingContact).length > 0 ? "Update" : "Create"}</button>
        </form>
    );
};

export default ContactForm;