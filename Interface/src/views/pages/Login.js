import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
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
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const { i18n } = useTranslation();
  const [tab, setTab] = useState('login');
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupCredentials, setSignupCredentials] = useState({ email: '', password: '', confirmPassword: '' });
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
  
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginCredentials)
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Guardar en localStorage
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role);
  
        alert(`✅ ${data.message}\nBienvenida ${data.email}\nRol: ${data.role}`);
  
        // Redirigir por rol
        if (data.role === 'admin') {
          navigate('/AdminHistorial');
        } else {
          navigate('/UserDashboard');
        }
      } else {
        const error = await response.json();
        alert("❌ Error: " + error.detail);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert("❌ Error al conectar con el servidor");
    }
  };
  

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    // navigate('/dashboard');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="login-mars-light-bg min-vh-100 d-flex flex-column">
      <CHeader position="sticky" className="mb-4 p-0">
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderNav className="ms-auto">
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem active={colorMode === 'light'} onClick={() => setColorMode('light')}>
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem active={colorMode === 'auto'} onClick={() => setColorMode('auto')}>
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>🌐</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>English</CDropdownItem>
                <CDropdownItem active={i18n.language === 'es'} onClick={() => changeLanguage('es')}>Español</CDropdownItem>
                <CDropdownItem active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}>Français</CDropdownItem>
                <CDropdownItem active={i18n.language === 'pt'} onClick={() => changeLanguage('pt')}>Português</CDropdownItem>
                <CDropdownItem active={i18n.language === 'ct'} onClick={() => changeLanguage('ct')}>Català</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>
        </CContainer>
      </CHeader>
      <div className="mars-brand-bar w-100 d-flex justify-content-center align-items-center">
        <div className="mars-brand-content d-flex align-items-center">
          <img src={marsLogo} alt="Mars Logo" className="mars-brand-logo me-2" />
          <span className="mars-brand-text">Cloud Stripe</span>
        </div>
      </div>
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div className="mars-login-container-light">
          <form className="mars-login-form-light" onSubmit={isSignUp ? handleSignupSubmit : handleLoginSubmit}>
            <label htmlFor="loginEmail" className="mars-label-light">Your email</label>
            <div className="mars-input-icon-group">
              <span className="mars-input-icon"><CIcon icon={cilUser} /></span>
              <input
                type="email"
                id={isSignUp ? 'signupEmail' : 'loginEmail'}
                name="email"
                value={isSignUp ? signupCredentials.email : loginCredentials.email}
                onChange={isSignUp ? handleSignupChange : handleLoginChange}
                required
                className="mars-input-light"
                placeholder="e.g. elon@tesla.com"
              />
            </div>
            <label htmlFor="loginPassword" className="mars-label-light">Your password</label>
            <div className="mars-input-icon-group">
              <span className="mars-input-icon"><CIcon icon={cilLockLocked} /></span>
              <input
                type="password"
                id={isSignUp ? 'signupPassword' : 'loginPassword'}
                name="password"
                value={isSignUp ? signupCredentials.password : loginCredentials.password}
                onChange={isSignUp ? handleSignupChange : handleLoginChange}
                required
                className="mars-input-light"
                placeholder="e.g. ilovemars123"
              />
            </div>
            {isSignUp && (
              <>
                <label htmlFor="signupConfirmPassword" className="mars-label-light">Confirm password</label>
                <div className="mars-input-icon-group">
                  <span className="mars-input-icon"><CIcon icon={cilLockLocked} /></span>
                  <input
                    type="password"
                    id="signupConfirmPassword"
                    name="confirmPassword"
                    value={signupCredentials.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    className="mars-input-light"
                    placeholder="Repeat your password"
                  />
                </div>
              </>
            )}
            <button type="submit" className="mars-login-btn-light">{isSignUp ? 'Sign Up' : 'Login'}</button>
            <div className="d-flex justify-content-between mt-3">
              {!isSignUp ? (
                <a href="#" className="mars-link-light" onClick={e => { e.preventDefault(); setIsSignUp(true); }}>Don't have an account?</a>
              ) : (
                <a href="#" className="mars-link-light" onClick={e => { e.preventDefault(); setIsSignUp(false); }}>Already have an account?</a>
              )}
              <a href="#" className="mars-link-light">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;