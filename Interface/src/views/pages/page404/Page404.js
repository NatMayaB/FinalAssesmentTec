import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilMoon, cilSun, cilContrast, cilUser } from '@coreui/icons'
import { useColorModes } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import '../../../scss/Page404.scss'
import { AppHeaderDropdown } from '../../../components/header'

const Page404 = () => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { t, i18n } = useTranslation()

  return (
    <div className="page404-container">
      <header className="dashboard-header" style={{ width: '100vw', left: 0, margin: 0 }}>
        <div className="header-left">
          <AppHeaderDropdown />
        </div>
        <div className="header-right">
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
              <CDropdownItem active={colorMode === 'light'} onClick={() => setColorMode('light')}><CIcon className="me-2" icon={cilSun} size="lg" /> Light</CDropdownItem>
              <CDropdownItem active={colorMode === 'dark'} onClick={() => setColorMode('dark')}><CIcon className="me-2" icon={cilMoon} size="lg" /> Dark</CDropdownItem>
              <CDropdownItem active={colorMode === 'auto'} onClick={() => setColorMode('auto')}><CIcon className="me-2" icon={cilContrast} size="lg" /> Auto</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>🌐</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem active={i18n.language === 'en'} onClick={() => i18n.changeLanguage('en')}>English</CDropdownItem>
              <CDropdownItem active={i18n.language === 'es'} onClick={() => i18n.changeLanguage('es')}>Español</CDropdownItem>
              <CDropdownItem active={i18n.language === 'fr'} onClick={() => i18n.changeLanguage('fr')}>Français</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </header>
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="text-center">
          <div className="page404-title">404</div>
          <h2 className="page404-message">{t('pageNotFoundTitle')}</h2>
          <p className="page404-description">
            {t('pageNotFoundMessage1')}<br />
            {t('pageNotFoundMessage2')}
          </p>
          <button className="page404-btn" onClick={() => window.location.href = '#/login'}>
            <CIcon icon={cilHome} className="me-2" />
            {t('return')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page404
