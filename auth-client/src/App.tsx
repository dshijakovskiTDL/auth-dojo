import { Route, Routes } from 'react-router';

import TokensLayout from './pages/tokens/layout';
import TokensLogin from './pages/tokens/login';
import TokensHomepage from './pages/tokens';

import SessionLayout from './pages/session/layout';
import SessionHomepage from './pages/session';
import SessionLogin from './pages/session/login';

import OAuthDemo from './pages/oauth';

import Homepage from './pages/home';

import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="container mx-auto py-10 grid place-content-center">
        <Routes>
          <Route path="oauth" element={<OAuthDemo />} />

          <Route path="token">
            <Route element={<TokensLayout mode="auth" />}>
              <Route index element={<TokensHomepage />} />
            </Route>

            <Route element={<TokensLayout mode="no-auth" />}>
              <Route path="login" element={<TokensLogin />} />
            </Route>
          </Route>

          <Route path="session">
            <Route element={<SessionLayout mode="auth" />}>
              <Route index element={<SessionHomepage />} />
            </Route>

            <Route element={<SessionLayout mode="no-auth" />}>
              <Route path="login" element={<SessionLogin />} />
            </Route>
          </Route>

          <Route path="/" element={<Homepage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
