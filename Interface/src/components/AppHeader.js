import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { // Import the components from the coreui library that are needed
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilContrast, cilMoon, cilSun } from '@coreui/icons'
import { useTranslation } from 'react-i18next'  // Import the hook for translations

import { AppHeaderDropdown } from './header/index' // Import the AppHeaderDropdown component

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')// Access the color mode
  const { i18n } = useTranslation()  // Access i18n for changing language
  const dispatch = useDispatch()

  // Function to toggle the shadow of the header
  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  // Function to change the language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  // Function to render the header
  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          {/* Add any icon or button */}
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* Theme Switcher Dropdown */}
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
              <CDropdownItem
                active={colorMode === 'light'}
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* Language Switcher Dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              🌐 {/* Icon for Language */}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={i18n.language === 'en'}
                onClick={() => changeLanguage('en')}
              >
                English
              </CDropdownItem>
              <CDropdownItem
                active={i18n.language === 'es'}
                onClick={() => changeLanguage('es')}
              >
                Español
              </CDropdownItem>
              <CDropdownItem
                active={i18n.language === 'fr'}
                onClick={() => changeLanguage('fr')}
              >
                Français
              </CDropdownItem>
              <CDropdownItem
                active={i18n.language === 'pt'}
                onClick={() => changeLanguage('pt')}
              >
                Português
              </CDropdownItem>
              <CDropdownItem
                active={i18n.language === 'ct'}
                onClick={() => changeLanguage('ct')}
              >
                Català
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
