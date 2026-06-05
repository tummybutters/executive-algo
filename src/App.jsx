import { MotionConfig } from 'motion/react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import './pages.css';
import Spotlight from './pages/Spotlight.jsx';
import SpotlightDetail from './pages/SpotlightDetail.jsx';
import SiteLayout from './layouts/SiteLayout.jsx';
import SegmentLanding from './pages/SegmentLanding.jsx';
import { landingPages } from './data/landingPages.js';
import { problemPage, methodPage, momentPage } from './data/pages.js';
import EditorialPage from './pages/EditorialPage.jsx';
import PeoplePage from './pages/PeoplePage.jsx';
import BriefPage from './pages/BriefPage.jsx';
import Seo from './components/Seo.jsx';

export default function App() {
  return (
    <MotionConfig transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
      <Seo />
      <SiteLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spotlight" element={<Spotlight />} />
          <Route path="/spotlight/:slug" element={<SpotlightDetail />} />
          <Route path="/problem" element={<EditorialPage data={problemPage} slug="problem" />} />
          <Route path="/method" element={<EditorialPage data={methodPage} slug="method" />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/moment" element={<EditorialPage data={momentPage} slug="moment" />} />
          <Route path="/brief" element={<BriefPage />} />

          <Route path="/for-vcs" element={<SegmentLanding data={landingPages['for-vcs']} />} />
          <Route path="/for-founders" element={<SegmentLanding data={landingPages['for-founders']} />} />
          <Route path="/for-operators" element={<SegmentLanding data={landingPages['for-operators']} />} />
          <Route path="/for-researchers" element={<SegmentLanding data={landingPages['for-researchers']} />} />
          <Route path="/for-investors" element={<SegmentLanding data={landingPages['for-investors']} />} />
        </Routes>
      </SiteLayout>
    </MotionConfig>
  );
}
