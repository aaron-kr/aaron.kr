import React from 'react'
import './About.css'

const About = () => {
  return ( 
    <section id='about' className='main-section container'>
      <h2 className='section-title'>About</h2>
      <p>View full profile on <a href='https://linkedin.com/in/aaronsnowberger/'>LinkedIn <i className='fas fa-long-arrow-alt-right'></i></a></p>
      
      <h3>Web Development</h3>
      <p>I'm a skilled web developer with over 9 years experience building and managing client websites and 5 years experience contributing to Open Source projects like <a href="https://profiles.wordpress.org/jekkilekki">WordPress</a>. I'm proficient in HTML, CSS, JavaScript, PHP, WordPress, React, and React Native, and have taught website design and development as part of the core technology curriculum in <a href="https://gpa.kr">GPA International High School</a> from 2013 - 2019.</p>
      
      <h3>Graphic Design</h3>
      <p>I'm also an <a href="https://aaronsnowberger.com">experienced graphic designer</a> specializing in Adobe InDesign, Adobe Photoshop, and Adobe Illustrator. I've freelanced for over 5 years and have professional experience creating business cards, brochures, ads, flyers, posters, banners, t-shirts, logos, websites, branded materials, newsletters, magazines, books, and more. Additionally, I teach  graphic design and computer literacy courses at GPA High School.</p>
      
      <h3>ESL</h3>
      <p>I'm an experienced ESL teacher with over 13 years in classrooms in Korea. I've taught conversational English and Speech/Presentation classes to university students for over 10 years at Jeonju University. Additionally, I've taught TOEIC Speaking, TOEFL Writing, Speaking, and Reading, and Drama and Debate for over 3 years to various age levels from elementary school to adult.</p>
    </section>
  )
}
 
export default About