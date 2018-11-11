import React from 'react'
import './Projects.css'

const Projects = () => {
  return (
    <section id='projects' className='main-section'>
      <h2 className='section-title'>Projects</h2>
      <ul className='list-boxes'>
        <li className='list-box-item'>
          {/* <a href='https://keytokorean.com' style={{background: 'rgb(83, 191, 156)'}}> */}
            <figure class="effect">
              <img src="/img/aaronsnowberger-com.png" alt="AaronSnowberger.com" />
              <figcaption>
                <h3>AaronSnowberger.com</h3>
                <p>My online graphic design portfolio</p>
                <p><strong>Tags:</strong><br />WordPress, Express</p>
                <a class="visit" href="https://aaronsnowberger.com" target="_blank">Visit site</a>
                <span class="icon"><i class="fa fa-share"></i></span>
              </figcaption>
            </figure>
          {/* </a> */}
        </li>
        <li className='list-box-item'>
          <a href='https://gpa.justkeeplearning.xyz' style={{background: '#303F9F'}}>GPA High School</a>
        </li>
        <li className='list-box-item'>
          <a href='https://marsx.kr' style={{background: '#000000'}}>MarsX.kr</a>
        </li>
        <li className='list-box-item'>
          <a href='https://aaronsnowberger.com' style={{background: '#455A64'}}>AaronSnowberger.com</a>
        </li>
        <li className='list-box-item'>
          <a href='' style={{background: '#303F9F'}}>KOTESOL Workshops web app</a>
        </li>
        <li className='list-box-item'>
          <a href='https://conference.jnjkotesol.com' style={{background: '#a0f'}}>JNJ KOTESOL Conference site</a>
        </li>
      </ul>
    </section>
  )
}
 
export default Projects