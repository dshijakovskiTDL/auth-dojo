import { Route, Routes } from 'react-router';

import Dashboard from './components/dashboard';
import Footer from './components/footer';
import Header from './components/header';
import OAuthForm from './components/login/oauth-login-form';
import SignUpForm from './components/signup-form';
import TwoFactorLayout from './pages/2fa/layout';
import TwoFactorLogin from './pages/2fa/login';
import TwoFactorVerify from './pages/2fa/verify';
import TwoFactorVerifyLayout from './pages/2fa/verify-layout';
import Homepage from './pages/home';
import OAuthLayout from './pages/oauth/layout';
import SessionLayout from './pages/session/layout';
import SessionLogin from './pages/session/login';
import TokensLayout from './pages/tokens/layout';
import TokenLogin from './pages/tokens/login';

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
              <Route path="login" element={<TokenLogin />} />
              <Route path="signup" element={<SignUpForm authRoute="token" />} />
            </Route>
          </Route>

          <Route path="session">
            <Route element={<SessionLayout mode="auth" />}>
              <Route index element={<Dashboard authRoute="session" />} />
            </Route>

            <Route element={<SessionLayout mode="no-auth" />}>
              <Route path="login" element={<SessionLogin />} />
              <Route path="signup" element={<SignUpForm authRoute="session" />} />
            </Route>
          </Route>

          <Route path="oauth">
            <Route element={<OAuthLayout mode="auth" />}>
              <Route index element={<Dashboard authRoute="oauth" />} />
            </Route>

            <Route element={<OAuthLayout mode="no-auth" />}></Route>
            <Route path="login" element={<OAuthForm />} />
          </Route>

          <Route path="2fa">
            <Route element={<TwoFactorLayout mode="auth" />}>
              <Route index element={<Dashboard authRoute="2fa" />} />
            </Route>

            <Route element={<TwoFactorLayout mode="no-auth" />}>
              <Route path="login" element={<TwoFactorLogin />} />

              <Route element={<TwoFactorVerifyLayout />}>
                <Route path="verify" element={<TwoFactorVerify />} />
              </Route>

              <Route path="signup" element={<SignUpForm authRoute="2fa" />} />
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
