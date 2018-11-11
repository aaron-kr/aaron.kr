import React from 'react'
import './Talks.css'

const Talks = () => {
  return (
    <section id='talks' className='main-section'>
            <h2 className='section-title'>Talks</h2>

            <ul className='list-index'><span className='list-index-date'>2018</span>
              <li className='latest-talk list-index-item list-index-upcoming'>
                <a href='http://aaron.kr/talks/notes/11-google-services.html'>
                  <img className='latest-talk-image' src='/img/atomic-habits-ppt.jpg' />
                  <span className='talk-title'>Atomic Habits that will turn you into a Superhero</span><br />
                  <span className='talk-location'>Jeonju KOTESOL Conference 2018</span>
                  <span className='talk-date'>17 November 2018</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='http://aaron.kr/talks/notes/11-google-services.html'>
                  <span className='talk-title'>11 Great Google Services (for your Classroom)</span>
                  <span className='talk-location'>Jeonju KOTESOL Conference 2017</span>
                  <span className='talk-date'>11 November 2017</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='http://aaron.kr/talks/notes/google-classNameroom.html'>
                  <span className='talk-title'>Google Classroom 101</span>
                  <span className='talk-location'>KOTESOL Int'l Conference 2017</span>
                  <span className='talk-date'>21 October 2017</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='' disabled>
                  <span className='talk-title'>G Suite for Education Training</span>
                  <span className='talk-location'>GPA HS Teacher Training Seminar</span>
                  <span className='talk-date'>16 August 2017</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='' disabled>
                  <span className='talk-title'>Teacher Tech Tips</span>
                  <span className='talk-location'>GPA HS Teacher Training Seminar</span>
                  <span className='talk-date'>17 February 2017</span>
                </a>
              </li>
            </ul>

            <ul className='list-index'><span className='list-index-date'>2016</span>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/become-a-better-presenter-kotesol'>
                  <span className='talk-title'>Become a Better Presenter by Becoming a Better Teacher (and vice versa)</span><br />
                  <span className='talk-location'>Jeonju KOTESOL Workshop</span>
                  <span className='talk-date'>9 April 2016</span>
                </a>
              </li>
            </ul>

            <ul className='list-index'><span className='list-index-date'>2015</span>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/kotesol-national-conference-2015-a-roadmap-for-wordpress-as-lms'>
                  <span className='talk-title'>A Roadmap for WordPress as LMS</span>
                  <span className='talk-location'>KOTESOL National Conference 2015</span>
                  <span className='talk-date'>30 May 2015</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/gpa-hs-career-day-computer-science'>
                  <span className='talk-title'>Computer Science as a Career</span>
                  <span className='talk-location'>GPA HS Career Day</span>
                  <span className='talk-date'>16 April 2015</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/kotesol-jj-wordpress-as-lms-learning-management-system'>
                  <span className='talk-title'>WordPress in your Classroom as an LMS</span>
                  <span className='talk-location'>Jeonju KOTESOL Workshop</span>
                  <span className='talk-date'>14 March 2015</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/wordpress-meetup-jeonju-number-2-a-comprehensive-overview-of-wp-site-owner-roles'>
                  <span className='talk-title'>A Comprehensive Overview of WP Site Owner Roles</span>
                  <span className='talk-location'>Jeonju WordPress Meetup</span>
                  <span className='talk-date'>7 March 2015</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/seoul-2015-meetup-open-source-wordpress-and-the-community'>
                  <span className='talk-title'>Open Source, WordPress, &amp; the Community</span>
                  <span className='talk-location'>Seoul WordPress Grand Meetup 2015</span>
                  <span className='talk-date'>28 February 2015</span>
                </a>
              </li>
              <li className='list-index-item'>
                <a href='https://speakerdeck.com/asnowberger/wordpress-meetup-jeonju-number-1-wordpress-overview'>
                  <span className='talk-title'>WordPress Overview</span>
                  <span className='talk-location'>Jeonju WordPress Meetup</span>
                  <span className='talk-date'>24 January 2015</span>
                </a>
              </li>
            </ul>

            <ul className='list-index'><span className='list-index-date'>2014</span>
              <li className='list-index-item'>
                <a href='' disabled>
                  <span className='talk-title'>From Delinquent to Star Student</span>
                  <span className='talk-subtitle'>My journey toward second-language learning motivation</span><br />
                  <span className='talk-location'>Jeonju KOTESOL Conference 2014</span>
                  <span className='talk-date'>12 April 2014</span>
                </a>
              </li>
            </ul>

            {/* <ul className='list-index'><span className='list-index-date'>2013</span>
            </ul> */}

            <ul className='list-index'><span className='list-index-date'>2012</span>
              <li className='list-index-item'>
                <a href='' disabled>
                  <span className='talk-title'>Technology Upgrade:</span>
                  <span className='talk-subtitle'>Build a Customized Gradebook</span>
                  <span className='talk-location'>Jeonju KOTESOL Conference 2012</span>
                  <span className='talk-date'>21 April 2012</span>
                </a>
              </li>
            </ul>
          </section>
  )
}
 
export default Talks