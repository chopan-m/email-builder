import React, { useState, useEffect } from 'react';

const TemplateList = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Update this useEffect to run more frequently
  useEffect(() => {
    const loadTemplates = () => {
      const savedTemplates = JSON.parse(localStorage.getItem('templates')) || [];
      console.log('Current templates in localStorage:', savedTemplates);
      setTemplates(savedTemplates);
    };

    loadTemplates();
    
    // Increase polling frequency for testing
    const interval = setInterval(loadTemplates, 500);

    return () => clearInterval(interval);
  }, []);

  const addTemplate = () => {
    if (newTemplateName.trim()) {
      // Get existing templates first
      const existingTemplates = JSON.parse(localStorage.getItem('templates')) || [];
      
      const newTemplate = {
        id: Date.now(),
        name: newTemplateName.trim(),
        html: '<div>New Template</div>',
        css: '',
        createdAt: new Date().toISOString()
      };

      // Add new template to existing ones
      const updatedTemplates = [...existingTemplates, newTemplate];
      
      // Debug logs
      console.log('Adding new template:', newTemplate);
      console.log('Updated templates array:', updatedTemplates);
      
      // Update both state and localStorage
      setTemplates(updatedTemplates);
      localStorage.setItem('templates', JSON.stringify(updatedTemplates));
      setNewTemplateName('');
    }
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('templates', JSON.stringify(updatedTemplates));
  };

  return (
    <div className="card template-list-card">
      <h3>Email Templates</h3>
      <div className="template-form">
        <input
          type="text"
          placeholder="Enter template name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          className="input-field"
        />
        <button onClick={addTemplate} className="submit-button">
          Add Template
        </button>
      </div>
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-item">
            <div className="template-header">
              <h4>{template.name}</h4>
              <div className="template-actions">
                <button 
                  onClick={() => onSelectTemplate(template)} 
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteTemplate(template.id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="template-info">
              <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
              {template.lastModified && (
                <span>Modified: {new Date(template.lastModified).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateList;
