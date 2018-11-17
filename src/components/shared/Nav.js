import React from 'react'
import './Nav.css'

const Nav = () => {
  return (
    <nav className='site-navigation navbar' role='navigation'>
      <ul className='main-menu'>
        <li className="site-nav-item">
          <a href="https://aaron.kr/content/talks/" data-scroll='talks'>Talks</a>
        </li>
        <li className="site-nav-item">
          <a href="https://aaron.kr/content/talks/google-classroom-101/" data-scroll='classes'>Classes</a>
        </li>
        <li className="site-nav-item">
          <a href="https://aaronsnowberger.com" data-scroll='projects'>Projects</a>
        </li>
        <li className="site-nav-item">
          <a href="https://linkedin.com/in/aaronsnowberger" data-scroll='about'>About</a>
        </li>
      </ul>
    </nav>
  )
}
 
export default Nav