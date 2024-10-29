import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const EmailList = () => {
  const [emailGroups, setEmailGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [emails, setEmails] = useState('');

  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('emailGroups')) || [];
    setEmailGroups(savedGroups);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (results) => {
        // Assuming the CSV has an email column
        const emailList = results.data
          .map(row => row[0])
          .filter(email => email && email.includes('@'))
          .join(', ');
        setEmails(emailList);
      }
    });
  };

  const addEmailGroup = () => {
    if (groupName && emails) {
      const newGroup = {
        name: groupName,
        emails: emails.split(',').map(e => e.trim())
      };
      const updatedGroups = [...emailGroups, newGroup];
      setEmailGroups(updatedGroups);
      localStorage.setItem('emailGroups', JSON.stringify(updatedGroups));
      setGroupName('');
      setEmails('');
    }
  };

  return (
    <div className="card email-group-card">
      <h3>Email Groups</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Enter emails (comma-separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="textarea-field"
        />
        <div className="file-upload">
          <label className="file-upload-label">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
            />
          </label>
        </div>
        <button onClick={addEmailGroup} className="submit-button">
          Add Email Group
        </button>
      </div>
      <div className="email-groups-list">
        {emailGroups.map((group, index) => (
          <div key={index} className="email-group-item">
            <h4>{group.name}</h4>
            <p>{group.emails.length} emails</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailList;
