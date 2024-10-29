import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetNewsletter from 'grapesjs-preset-newsletter';

const EmailBuilder = ({ selectedTemplate, onSave }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '70vh',
      width: 'auto',
      storageManager: false,
      plugins: [gjsPresetNewsletter],
      pluginsOpts: {
        gjsPresetNewsletter: {
          // Configure email template options
          textCleanCanvas: true,
          modalTitleImport: 'Import template',
          modalLabelImport: 'Paste your HTML/CSS here',
          modalLabelExport: 'Get HTML/CSS',
          importPlaceholder: '<!-- Your HTML here -->',
          inlineCss: true,
          cellStyle: {
            'vertical-align': 'top',
            padding: 0,
            margin: 0
          }
        }
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
        ]
      }
    });

    editorInstance.current = editor;

    // Load template content if provided
    if (selectedTemplate?.html) {
      editor.setComponents(selectedTemplate.html);
      if (selectedTemplate.css) {
        editor.setStyle(selectedTemplate.css);
      }
    }

    // Add save command with proper email structure
    editor.Commands.add('save-template', {
      run: () => {
        const html = editor.runCommand('gjs-get-inlined-html');
        const css = editor.getCss();
        
        // Create email-friendly template structure
        const emailTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${selectedTemplate.name}</title>
  <style type="text/css">
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`.trim();

        const updatedTemplate = {
          ...selectedTemplate,
          html: emailTemplate,
          css: css,
          lastModified: new Date().toISOString()
        };
        
        onSave(updatedTemplate);
      }
    });

    return () => {
      editor.destroy();
    };
  }, [selectedTemplate]);

  return <div ref={editorRef} />;
};

export default EmailBuilder;
