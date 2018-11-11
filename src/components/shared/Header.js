import React from 'react'
import Nav from './Nav'
import './Header.css'

const Header = () => {
  return (  
    <header className='site-header' role='banner'>
      <a className="login-button" href='https://aaron.kr/content/wp-admin'></a>
      <a className='site-title' href='https://aaron.kr'>
        <h1>Aaron.kr</h1>
        <img className="logo" src="" />
      </a>
      <Nav />
    </header>
  )
}
 
export default Header