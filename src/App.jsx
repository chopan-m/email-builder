import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailList from './components/EmailList';
import TemplateList from './components/TemplateList';
import CampaignCreation from './components/CampaignCreation';
import EmailBuilder from './components/EmailBuilder'; // Import EmailBuilder

function App() {
  const [currentView, setCurrentView] = useState('templateList');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState(
    JSON.parse(localStorage.getItem('templates')) || []
  );

  // Add this useEffect to keep templates state in sync with localStorage
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('templates')) || [];
    setTemplates(savedTemplates);
  }, [currentView]);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('emailBuilder');
  };

  const handleSaveTemplate = (updatedTemplate) => {
    const existingTemplates = JSON.parse(localStorage.getItem('templates')) || [];
    const updatedTemplates = existingTemplates.map(template => 
      template.id === updatedTemplate.id ? updatedTemplate : template
    );
    
    localStorage.setItem('templates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
    
    alert('Template saved successfully!');
    setCurrentView('templateList');
  };

  const renderView = () => {
    switch (currentView) {
      case 'emailList':
        return <EmailList />;
      case 'templateList':
        return <TemplateList 
          templates={templates}
          onSelectTemplate={handleSelectTemplate} 
        />;
      case 'campaignCreation':
        return <CampaignCreation />;
      case 'emailBuilder':
        return <EmailBuilder 
          selectedTemplate={selectedTemplate}
          onSave={handleSaveTemplate}
        />;
      default:
        return <EmailList />;
    }
  };

  return (
    <div className="App">
      <Header onNavigate={setCurrentView} />
      <div className="content">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
