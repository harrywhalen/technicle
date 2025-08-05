import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import lessonData from "../data/lessondata.json";
import contentBS from "../data/lessondataBS.json";
import contentCFS from "../data/lessondataCFS.json";
import contentBERK from "../data/lessondataBERK.json";
import test from "../data/test.json";

// Simulated module content "database"
const moduleDatabase = {
  1: {
    title: 'The Income Statement',
    content: lessonData,
  },
  2: {
    title: 'State Management',
    content: contentBS,
  },
  3: {
    title: 'Berk Hath',
    content: contentCFS,
  },
  4: {
    title: 'Routing',
    content: test,
  },
  5: {
    title: 'Testing',
    content: contentBERK,
  },
  6: {
    title: 'Performance',
    content: contentBERK,
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
}
