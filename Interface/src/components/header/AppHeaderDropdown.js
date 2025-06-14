import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import userLogo from '../../assets/images/userLogo.png'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/#/login';
  };

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle caret={false} style={{ marginLeft: '-16px' }}>
        <CAvatar style={{ background: 'transparent', color: '#bf5534' }}>
          <CIcon icon={cilUser} size="xl" />
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="user-dropdown-header" style={{ color: 'inherit' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600 }} className="user-email-dropdown">
            {userEmail ? userEmail : t('user')}
          </div>
        </CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ color: '#E26E2F', fontWeight: 600 }}>
          <CIcon icon={cilLockLocked} className="me-2" /> {t('logout')}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown