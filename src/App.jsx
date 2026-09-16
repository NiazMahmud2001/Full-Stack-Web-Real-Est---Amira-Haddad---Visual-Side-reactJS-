import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ScrollToTop from './components/common/ScrollToTop';
import CustomCursor from './components/motion/CustomCursor';
import ContentProvider from './context/ContentProvider';


import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Explorer from './pages/Explorer';
import PropertyDetail from './pages/PropertyDetail';

// The admin area (src/admin) is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));


// The public website. ContentProvider shows the loading page, then these pages.
function PublicSite() {
  return (
    <ContentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </ContentProvider>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />

      <Routes>
        {/* The admin page has its own sign-in and skips the website's loading page. */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="p-10 text-stone-500">Loading…</div>}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicSite />} />
      </Routes>

    </Router>
  );
}

export default App;
