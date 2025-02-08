import { Navigate, Route, Routes } from 'react-router-dom';
import { UfyleLayout } from './components/layout';
import { HomePage } from './pages/home-page';
import { RecentPage } from './pages/recent-page';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />
      <Route element={<UfyleLayout />}>
        <Route
          path="/home"
          element={<HomePage />}
        />
        <Route
          path="/documents"
          element={<div>Documents</div>}
        />
        <Route
          path="/pictures"
          element={<div>Pictures</div>}
        />
        <Route
          path="/music"
          element={<div>Music</div>}
        />
        <Route
          path="/videos"
          element={<div>Videos</div>}
        />
        <Route
          path="/starred"
          element={<div>Starred</div>}
        />
        <Route
          path="/recent"
          element={<RecentPage />}
        />
        <Route
          path="/shared"
          element={<div>Shared</div>}
        />
        <Route
          path="/trash"
          element={<div>Trash</div>}
        />
      </Route>
    </Routes>
  );
}

export default App;
