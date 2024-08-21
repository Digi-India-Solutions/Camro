import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://api.camrosteel.com/api/v1/getContact');
        setContacts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4">All Contacts</h1>
      {loading ? (
        <div>Loading...</div>
      ) : contacts.length === 0 ? (
        <div>No contacts available.</div>
      ) : (
        <table className="table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone Number</th>
              <th className="border px-4 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{contact.Name}</td>
                <td className="border px-4 py-2">{contact.Email}</td>
                <td className="border px-4 py-2">{contact.PhoneNumber}</td>
                <td className="border px-4 py-2">{contact.Message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Contacts;
