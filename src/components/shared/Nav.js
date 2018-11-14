import React from 'react'
import './Nav.css'

const Nav = () => {
  return (
    <nav className='site-navigation navbar' role='navigation'>
      <ul className='main-menu'>
        <li className="site-nav-item">
          <a href="#" data-scroll='talks'>Talks</a>
        </li>
        <li className="site-nav-item">
          <a href="#" data-scroll='classes'>Classes</a>
        </li>
        <li className="site-nav-item">
          <a href="#" data-scroll='projects'>Projects</a>
        </li>
        <li className="site-nav-item">
          <a href="#" data-scroll='about'>About</a>
        </li>
      </ul>
    </nav>
  )
}
 
export default Nav