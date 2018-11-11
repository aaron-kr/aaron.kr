import React from 'react'
import './Intro.css'
import Flipper from './Flipper'

const Intro = () => {
  return (
    <section className='intro'>
      <figure>
        <img className='profile-pic' src='img/aaron-profile-2018.jpg' />
      </figure>
      <h1 className='site-title huge'>Aaron<strong>Snowberger</strong></h1>
      <hr />
      <p className='self-intro'>
        안녕하세요, 나는 에런입니다. Hi, I'm Aaron.<br />I'm a <Flipper /><br />
        and I teach ESL &amp; Computers in Korea. 👍
        {/* <i className='fa fa-thumbs-o-up'></i> */}
      </p>
      <p>Find me on <a href='https://linkedin.com/in/aaronsnowberger'>LinkedIn</a> or elsewhere:</p>
      <ul className='intro-sites'>
        <li 
          className='intro-site-item' 
          style={{backgroundImage: "url('img/aaronsnowberger-small.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
          <a href='https://aaronsnowberger.com'>Design Portfolio</a>
        </li>
        <li className='intro-site-item'>
          <a href='https://keytokorean.com'>Korean blog</a>
        </li>
        <li className='intro-site-item'>
          <a href='https://github.com/jekkilekki'>GitHub code</a>
        </li>
        <li className='intro-site-item'>
          <a href='https://profiles.wordpress.org/jekkilekki'>WordPress</a>
        </li>
        <li className='intro-site-item'>
          <a href='https://twitter.com/jekkilekki'>Twitter</a>
        </li>
      </ul>
    </section>
  )
}
 
export default Intro