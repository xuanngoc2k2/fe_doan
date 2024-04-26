import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react/jsx-runtime';
import { ComponentType, ReactNode, useEffect } from 'react';
import DefaultLayout from './layouts/DefaultLayout/default-layout';
import { useAppDispatch } from './redux/hook';
import { fetchAccount } from './redux/slice/accountSlice';

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

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
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout: ComponentType<{ children: ReactNode }> | null = Fragment;
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
