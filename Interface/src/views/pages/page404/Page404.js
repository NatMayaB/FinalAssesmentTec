import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHome } from '@coreui/icons'
import AppHeader from '../../../components/AppHeader'
import { useColorModes } from '@coreui/react'
import { useTranslation } from 'react-i18next'

const Page404 = () => {
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [mode, setMode] = useState(colorMode)
  const { t } = useTranslation()

  // Forzar re-render cuando cambie el modo
  useEffect(() => {
    setMode(colorMode)
  }, [colorMode])

  // Colores para modo claro y oscuro
  const isDark = mode === 'dark'
  const background = isDark
    ? '#23242c'
    : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)'
  const textColor = isDark ? '#fff' : '#334155'
  const subTextColor = isDark ? '#e0e7ff' : '#64748b'
  const shadow404 = isDark ? '0 2px 16px #fff3' : '0 2px 16px #ffd699'

  return (
    <div
      className="min-vh-100"
      style={{
        background,
        transition: 'background 0.3s',
      }}
    >
      <AppHeader />
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        <div className="text-center">
          <div
            style={{
              fontSize: '8rem',
              fontWeight: 'bold',
              color: '#ff8800',
              textShadow: shadow404,
              letterSpacing: '0.1em',
              animation: 'bounce404 1.5s infinite alternate',
            }}
          >
            404
          </div>
          <h2 className="mt-4 mb-2" style={{ color: textColor, fontWeight: 700 }}>
            {t('pageNotFoundTitle')}
          </h2>
          <p className="mb-4" style={{ color: subTextColor, fontSize: '1.2rem' }}>
            {t('pageNotFoundMessage1')}<br />
            {t('pageNotFoundMessage2')}
          </p>
          <CButton
            color="primary"
            size="lg"
            href="#/login"
            style={{
              fontWeight: 600,
              padding: '0.75rem 2rem',
              borderRadius: '2rem',
              boxShadow: shadow404,
              '--cui-btn-color': isDark ? '#fff' : '#23242c',
            }}
          >
            <CIcon icon={cilHome} className="me-2" />
            {t('return')}
          </CButton>
        </div>
        <style>
          {`
            @keyframes bounce404 {
              0% { transform: translateY(0); }
              100% { transform: translateY(-20px); }
            }
          `}
        </style>
      </div>
    </div>
  )
}

export default Page404
