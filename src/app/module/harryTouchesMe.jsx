import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import lessonData from "../data/lessondata.json";
import contentBS from "../data/lessondataBS.json";

// Simulated module content "database"
const moduleDatabase = {
  1: {
    title: 'The Income Statement',
    content: content,
  },
  2: {
    title: 'State Management',
    content: contentBS,
  },
  3: {
    title: 'Hooks',
    content: 'Dive into useState, useEffect, and custom hooks.',
  },
  4: {
    title: 'Routing',
    content: 'Understand client-side routing with React Router or Next.js.',
  },
  5: {
    title: 'Testing',
    content: 'Get started with Jest, React Testing Library, and Cypress.',
  },
  6: {
    title: 'Performance',
    content: 'Optimize your React apps for speed and efficiency.',
  },
  // Add the rest of your modules here...
};

export default function ModulePage() {
  const router = useRouter();
  const { moduleId, action, moduleName } = router.query;

  const [moduleData, setModuleData] = useState(null);

  useEffect(() => {
    if (moduleId) {
      // Simulate loading module content based on moduleId
      const data = moduleDatabase[moduleId];
      setModuleData(
        data || { title: 'Module Not Found', content: 'This module does not exist.' }
      );
    }
  }, [moduleId]);

  if (!moduleData) {
    return <p style={{ padding: '2rem', fontSize: '18px' }}>Loading module...</p>;
  }

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '32px', color: '#333' }}>
        {decodeURIComponent(moduleName || '')}
      </h1>

      <p style={{ fontSize: '18px', color: '#666' }}>
        <strong>Action:</strong> {action}
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>{moduleData.title}</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{moduleData.content}</p>
      </div>
    </div>
  );
}
