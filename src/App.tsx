import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { Fragment } from 'react/jsx-runtime';
import { ComponentType, ReactNode } from 'react';
import DefaultLayout from './layouts/DefaultLayout/default-layout';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout: ComponentType<{ children: ReactNode }> | null = DefaultLayout;
            if (route.layout === null) {
              Layout = Fragment;
            } else if (route.layout) {
              Layout = route.layout;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={<Layout><Page /></Layout>} // Bọc Page trong Layout
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
