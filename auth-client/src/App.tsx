import { Route, Routes } from 'react-router';

import Dashboard from './components/dashboard';
import Footer from './components/footer';
import Header from './components/header';
import LoginForm from './components/login/login-form';
import Homepage from './pages/home';
import OAuthDemo from './pages/oauth';
import SessionLayout from './pages/session/layout';
import TokensLayout from './pages/tokens/layout';

function App() {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="container mx-auto grid place-content-center py-10">
        <Routes>
          <Route path="token">
            <Route element={<TokensLayout mode="auth" />}>
              <Route index element={<Dashboard authRoute="token" />} />
            </Route>

            <Route element={<TokensLayout mode="no-auth" />}>
              <Route path="login" element={<LoginForm authRoute="token" />} />
            </Route>
          </Route>

          <Route path="session">
            <Route element={<SessionLayout mode="auth" />}>
              <Route index element={<Dashboard authRoute="session" />} />
            </Route>

            <Route element={<SessionLayout mode="no-auth" />}>
              <Route path="login" element={<LoginForm authRoute="session" />} />
            </Route>
          </Route>

          <Route path="oauth" element={<OAuthDemo />} />

          <Route path="/" element={<Homepage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
