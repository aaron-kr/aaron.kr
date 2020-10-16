import React from 'react'
import Nav from './Nav'
import SiteHub from '../home/SiteHub'
import './Header.css'
import { useSession } from "../../firebase/UserProvider";


const Header = () => {
  const { user, isAdmin } = useSession();

  return (  
    <header className='site-header-container' role='banner'>
      {user && isAdmin &&
        <SiteHub />
      }
      <div className='site-header'>
        {/* <a className="login-button" href='https://aaron.kr/content/wp-admin'>Login</a> */}
        <a className='site-title' href='/'>
          <h1>Aaron.kr</h1>
          {/* <img className="logo" src="" alt="Site logo" /> */}
        </a>
        <Nav />
      </div>
    </header>
  )
}
 
export default Header