import React from 'react'
import './Intro.css'
import Flipper from './Flipper'
import { obj2arr } from '../../utils/helpers'
import { links } from '../../utils/_DATA'

const Intro = () => {
  let linksArr = obj2arr( links )

  return (
    <section className='intro'>
      <figure>
        <img className='profile-pic' src='img/aaron-profile-2018.jpg' alt="Aaron Snowberger" />
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

        { linksArr.map((link) => (
          <li 
            className='intro-site-item' 
            style={{
              backgroundImage: `url(${link.img})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center'
            }}
          >
            <a href={link.url}>{link.name}</a>
          </li>
        ))}

      </ul>
    </section>
  )
}
 
export default Intro