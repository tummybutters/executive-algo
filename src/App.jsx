import { MotionConfig } from 'motion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Spotlight from './pages/Spotlight.jsx';
import SpotlightDetail from './pages/SpotlightDetail.jsx';
import SiteLayout from './layouts/SiteLayout.jsx';

export default function App() {
  return (
    <MotionConfig transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
      <BrowserRouter>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spotlight" element={<Spotlight />} />
            <Route path="/spotlight/:slug" element={<SpotlightDetail />} />
          </Routes>
        </SiteLayout>
      </BrowserRouter>
    </MotionConfig>
  );
}
