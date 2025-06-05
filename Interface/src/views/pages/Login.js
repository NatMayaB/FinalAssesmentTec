import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  useColorModes,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilMoon, cilSun, cilContrast } from '@coreui/icons';
import marsLogo from '../../assets/images/logo.png';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [signupCredentials, setSignupCredentials] = useState({ email: '', password: '', confirmPassword: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch(`http://localhost:8000/login?lang=${i18n.language}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginCredentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role);
        if (data.role === 'admin') {
          navigate('/Admin/Dashboard');
        } else {
          navigate('/User/Dashboard');
        }
      } else {
        setErrorMessage(t("loginFailed"));
      }
    } catch (err) {
      console.error("Server error:", err);
      setErrorMessage(t("serverError"));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupCredentials.password !== signupCredentials.confirmPassword) {
      alert("❌ " + t("passwordsDontMatch"));
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupCredentials.email,
          password: signupCredentials.password
        })
      });
      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${t("registrationSuccess")}`);
        setIsSignUp(false);
        setErrorMessage('');
      } else {
        const error = await response.json();
        alert("❌ " + (error.detail === "user_exists" ? t("userExists") : error.detail));
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("❌ " + t("connectionError"));
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setErrorMessage('');
  };

  return (
    <div className="login-mars-light-bg min-vh-100 d-flex flex-column">
      <CHeader position="sticky" className="mb-4 p-0">
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderNav className="ms-auto">
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? <CIcon icon={cilMoon} size="lg" /> : colorMode === 'auto' ? <CIcon icon={cilContrast} size="lg" /> : <CIcon icon={cilSun} size="lg" />}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem active={colorMode === 'light'} onClick={() => setColorMode('light')}><CIcon className="me-2" icon={cilSun} size="lg" /> Light</CDropdownItem>
                <CDropdownItem active={colorMode === 'dark'} onClick={() => setColorMode('dark')}><CIcon className="me-2" icon={cilMoon} size="lg" /> Dark</CDropdownItem>
                <CDropdownItem active={colorMode === 'auto'} onClick={() => setColorMode('auto')}><CIcon className="me-2" icon={cilContrast} size="lg" /> Auto</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>🌐</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>English</CDropdownItem>
                <CDropdownItem active={i18n.language === 'es'} onClick={() => changeLanguage('es')}>Español</CDropdownItem>
                <CDropdownItem active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}>Français</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>
        </CContainer>
      </CHeader>

      <div className="mars-brand-bar w-100 d-flex justify-content-center align-items-center">
        <div className="mars-brand-content d-flex align-items-center">
          <img src={marsLogo} alt="Mars Logo" className="mars-brand-logo me-2" />
          <span className="mars-brand-text">{t("welcomeBrand")}</span>
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div className="mars-login-container-light">
          <form className="mars-login-form-light" onSubmit={isSignUp ? handleSignupSubmit : handleLoginSubmit}>
            <label htmlFor="loginEmail" className="mars-label-light">{t("yourEmail")}</label>
            <div className="mars-input-icon-group">
              <span className="mars-input-icon"><CIcon icon={cilUser} /></span>
              <input type="email" id={isSignUp ? 'signupEmail' : 'loginEmail'} name="email" value={isSignUp ? signupCredentials.email : loginCredentials.email} onChange={isSignUp ? handleSignupChange : handleLoginChange} required className="mars-input-light" placeholder="elon@tesla.com" />
            </div>
            <label htmlFor="loginPassword" className="mars-label-light">{t("yourPassword")}</label>
            <div className="mars-input-icon-group">
              <span className="mars-input-icon"><CIcon icon={cilLockLocked} /></span>
              <input type="password" id={isSignUp ? 'signupPassword' : 'loginPassword'} name="password" value={isSignUp ? signupCredentials.password : loginCredentials.password} onChange={isSignUp ? handleSignupChange : handleLoginChange} required className="mars-input-light" placeholder="••••••••" />
            </div>
            {isSignUp && (
              <>
                <label htmlFor="signupConfirmPassword" className="mars-label-light">{t("confirmPassword")}</label>
                <div className="mars-input-icon-group">
                  <span className="mars-input-icon"><CIcon icon={cilLockLocked} /></span>
                  <input type="password" id="signupConfirmPassword" name="confirmPassword" value={signupCredentials.confirmPassword} onChange={handleSignupChange} required className="mars-input-light" placeholder={t("confirmPassword")} />
                </div>
              </>
            )}
            <button type="submit" className="mars-login-btn-light">{isSignUp ? t("signUp") : t("login")}</button>
            {errorMessage && (
              <div className="text-danger mt-2" style={{ fontWeight: 'bold' }}>{errorMessage}</div>
            )}
            <div className="d-flex justify-content-between mt-3">
              {!isSignUp ? (
                <a href="#" className="mars-link-light" onClick={e => { e.preventDefault(); setIsSignUp(true); setErrorMessage(''); }}>{t("dontHaveAccount")}</a>
              ) : (
                <a href="#" className="mars-link-light" onClick={e => { e.preventDefault(); setIsSignUp(false); setErrorMessage(''); }}>{t("alreadyHaveAccount")}</a>
              )}
              <a href="#" className="mars-link-light">{t("forgotPassword")}</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
