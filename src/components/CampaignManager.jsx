import React, { useState } from 'react';

const CampaignManager = () => {
  const [emails, setEmails] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleEmailChange = (e) => {
    setSelectedEmail(e.target.value);
  };

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const createCampaign = () => {
    // Logic to create a campaign with selectedEmail and selectedTemplate
    console.log('Campaign created with:', selectedEmail, selectedTemplate);
  };

  return (
    <div>
      <h2>Create Campaign</h2>
      <select onChange={handleEmailChange}>
        <option value="">Select Email</option>
        {emails.map((email, index) => (
          <option key={index} value={email}>{email}</option>
        ))}
      </select>
      <select onChange={handleTemplateChange}>
        <option value="">Select Template</option>
        {templates.map((template, index) => (
          <option key={index} value={template}>{template}</option>
        ))}
      </select>
      <button onClick={createCampaign}>Create Campaign</button>
    </div>
  );
};

export default CampaignManager;
