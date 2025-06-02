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

const Login = () => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const { i18n } = useTranslation();
  const [tab, setTab] = useState('login');
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    // navigate('/dashboard');
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
    <div className="min-vh-100 d-flex flex-column">
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
      <div className="flex-grow-1 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6} lg={5} xl={4}>
              <CCard className="p-4">
                <CCardBody>
                  <h1 className="text-center mb-4">{tab === 'login' ? 'Login' : 'Signup'}</h1>
                  <div className="d-flex mb-4">
                    <CButton color={tab === 'login' ? 'primary' : 'secondary'} className="flex-fill" onClick={() => setTab('login')}>
                      Login
                    </CButton>
                    <CButton color={tab === 'signup' ? 'primary' : 'secondary'} className="flex-fill" onClick={() => setTab('signup')}>
                      Signup
                    </CButton>
                  </div>
                  {tab === 'login' ? (
                    <CForm onSubmit={handleLoginSubmit}>
                      <CFormLabel htmlFor="loginEmail">Email Address</CFormLabel>
                      <CFormInput
                        type="email"
                        id="loginEmail"
                        name="email"
                        value={loginCredentials.email}
                        onChange={handleLoginChange}
                        required
                        className="mb-3"
                        placeholder="Email Address"
                      />
                      <CFormLabel htmlFor="loginPassword">Password</CFormLabel>
                      <CFormInput
                        type="password"
                        id="loginPassword"
                        name="password"
                        value={loginCredentials.password}
                        onChange={handleLoginChange}
                        required
                        className="mb-2"
                        placeholder="Password"
                      />
                      <div className="mb-3 text-end">
                        <CButton color="link" className="p-0">Forgot password?</CButton>
                      </div>
                      <CButton color="primary" type="submit" className="w-100 mb-3">Login</CButton>
                      <div className="text-center">
                        Not a member?{' '}
                        <CButton color="link" className="p-0" onClick={() => setTab('signup')}>Signup now</CButton>
                      </div>
                    </CForm>
                  ) : (
                    <CForm onSubmit={handleSignupSubmit}>
                      <CFormLabel htmlFor="signupEmail">Email Address</CFormLabel>
                      <CFormInput
                        type="email"
                        id="signupEmail"
                        name="email"
                        value={signupCredentials.email}
                        onChange={handleSignupChange}
                        required
                        className="mb-3"
                        placeholder="Email Address"
                      />
                      <CFormLabel htmlFor="signupPassword">Password</CFormLabel>
                      <CFormInput
                        type="password"
                        id="signupPassword"
                        name="password"
                        value={signupCredentials.password}
                        onChange={handleSignupChange}
                        required
                        className="mb-3"
                        placeholder="Password"
                      />
                      <CFormLabel htmlFor="signupConfirmPassword">Confirm Password</CFormLabel>
                      <CFormInput
                        type="password"
                        id="signupConfirmPassword"
                        name="confirmPassword"
                        value={signupCredentials.confirmPassword}
                        onChange={handleSignupChange}
                        required
                        className="mb-3"
                        placeholder="Confirm Password"
                      />
                      <CButton color="primary" type="submit" className="w-100 mb-3">Signup</CButton>
                      <div className="text-center">
                        Already have an account?{' '}
                        <CButton color="link" className="p-0" onClick={() => setTab('login')}>Login</CButton>
                      </div>
                    </CForm>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default Login; 