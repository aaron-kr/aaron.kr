import React from 'react'
import './Nav.css'

const Nav = () => {
  return (
    <nav className='site-navigation' role='navigation'>
      <ul className='main-menu'>
        <li className="site-nav-item">
          <a href="https://aaron.kr/#talks">Talks</a>
        </li>
        <li className="site-nav-item">
          <a href="https://aaron.kr/#classes">Classes</a>
        </li>
        <li className="site-nav-item">
          <a href="https://aaron.kr/#projects">Projects</a>
        </li>
        <li className="site-nav-item">
          <a href="https://aaron.kr/#about">About</a>
        </li>
      </ul>
    </nav>
  )
}
 
export default Nav