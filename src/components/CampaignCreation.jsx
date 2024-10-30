import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; // Change import
import "react-datepicker/dist/react-datepicker.css"; // Import styles

const CampaignCreation = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [campaignName, setCampaignName] = useState('');
  const [emailGroups, setEmailGroups] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Load email groups and templates from localStorage
  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('emailGroups')) || [];
    const savedTemplates = JSON.parse(localStorage.getItem('templates')) || [];
    setEmailGroups(savedGroups);
    setTemplates(savedTemplates);
  }, []);

  const sendCampaign = async (campaign) => {
    try {
      const response = await fetch('https://manzoor-bhai-server-suycd.ondigitalocean.app/api/send-campaign', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailGroup: emailGroups.find(group => group.name === campaign.emailGroup),
          template: campaign.template
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Campaign sent successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      // alert('Failed to send campaign');
    }
  };

  const createCampaign = () => {
    if (!campaignName || !selectedGroup || !selectedTemplate) {
      alert('Please fill in all required fields');
      return;
    }

    const campaign = {
      id: Date.now(),
      name: campaignName,
      emailGroup: selectedGroup,
      template: templates.find(t => t.name === selectedTemplate), // Store full template object
      scheduledTime: scheduledTime.toISOString(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    // Save campaign to localStorage
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const updatedCampaigns = [...existingCampaigns, campaign];
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));

    // Reset form
    setCampaignName('');
    setSelectedGroup('');
    setSelectedTemplate('');
    setScheduledTime(new Date());

    // Show success message
    alert('Campaign created successfully!');

    // After saving to localStorage
    sendCampaign(campaign);
  };

  return (
    <div className="card campaign-card">
      <h3>Create Campaign</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="input-field"
        />
        
        <select 
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="select-field"
        >
          <option value="">Select Email Group</option>
          {emailGroups.map((group) => (
            <option key={group.name} value={group.name}>
              {group.name} ({group.emails.length} emails)
            </option>
          ))}
        </select>

        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="select-field"
        >
          <option value="">Select Template</option>
          {templates.map((template) => (
            <option key={template.id || template.name} value={template.name}>
              {template.name} {template.lastModified ? '(Modified)' : ''}
            </option>
          ))}
        </select>

        <div className="datetime-picker-wrapper">
          <label>Schedule Time</label>
          <DatePicker
            selected={scheduledTime}
            onChange={(date) => setScheduledTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="datepicker-input"
            placeholderText="Select date and time"
          />
        </div>

        <button onClick={createCampaign} className="submit-button">
          Create Campaign
        </button>
      </div>
    </div>
  );
};

export default CampaignCreation;
