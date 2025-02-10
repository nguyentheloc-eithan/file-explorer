import { Navigate, Route, Routes } from 'react-router-dom';
import { UfyleLayout } from './components/layout';
import { HomePage } from './pages/home-page';
import { RecentPage } from './pages/recent-page';
import TopFilesPage from './pages/top-files-page';

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
          path="/top-files"
          element={<TopFilesPage />}
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
