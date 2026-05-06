import { Route, Routes } from 'react-router';

import SessionAuthDemo from './pages/session';

import TokensLayout from './pages/tokens/layout';
import TokensLogin from './pages/tokens/login';
import TokensDemoDashboard from './pages/tokens';

import OAuthDemo from './pages/oauth';

import Homepage from './pages/home';
import HomepageLayout from './pages/home/layout';

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
              <Route index element={<TokensDemoDashboard />} />
            </Route>

            <Route element={<TokensLayout mode="no-auth" />}>
              <Route path="login" element={<TokensLogin />} />
            </Route>
          </Route>

          <Route path="session" element={<SessionAuthDemo />} />

          <Route path="/" element={<HomepageLayout />}>
            <Route index element={<Homepage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
