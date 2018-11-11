import React from 'react'
import './Classes.css'

const Classes = () => {
  return (
    <section id='classes' className='main-section'>
            <h2 className='section-title'>Classes</h2>

            <div className='classes-section'>
              <div className='tech-classes'>
                <h3 className='section-subtitle'><i className='fa fa-desktop'></i> Technology</h3>
            <ul className='list-tiles tech-classes-list'>
              <li className='list-tile-item'>
                <a href='http://www.bluepelicanjava.com/'>
                  <span className='class-name'>AP Computer Science (Java)</span>
                  <span className='class-curriculum'>Blue Pelican Java</span>
                  <span className='class-dates'>2016</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://code.org/educate/csp'>
                  <span className='class-name'>AP Computer Science Principles (JavaScript)</span>
                  <span className='class-curriculum'>Code.org</span>
                  <span className='class-dates'>2017</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://drive.google.com'>
                  <span className='class-name'>Computer A (Office)</span>
                  <span className='class-curriculum'>Touch typing, MS &amp; Google Office Suite</span>
                  <span className='class-dates'>2013, 2014, 2015</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://codecademy.com'>
                  <span className='class-name'>Computer B (Web programming)</span>
                  <span className='class-curriculum'>HTML, CSS, JS, jQuery, Bootstrap</span>
                  <span className='class-dates'>2013, 2014, 2015</span>
                </a>
              </li>
              <li className='list-tile-upcoming list-tile-upcoming'>
                <a href='' disabled>
                  <span className='class-name'>Computer C (App programming)</span>
                  <span className='class-curriculum'>Android / iPhone App Programming</span>
                  <span className='class-dates'>2018</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Graphic Design: Branding</span>
                  <span className='class-dates'>2016, 2017</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://gpa.justkeeplearning.xyz/yearbook'>
                  <span className='class-name'>Yearbook / Publishing</span>
                  <span className='class-dates'>2016, 2017</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='http://curriculum.vexrobotics.com/curriculum'>
                  <span className='class-name'>Robotics</span>
                  <span className='class-curriculum'>VEX Robotics</span>
                  <span className='class-dates'>2016, 2017</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://code.org/educate/csd'>
                  <span className='class-name'>Computer Science Discoveries</span>
                  <span className='class-curriculum'>Code.org</span>
                  <span className='class-dates'>2017</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://www.commonsense.org/education/digital-citizenship'>
                  <span className='class-name'>Digital Citizenship</span>
                  <span className='class-curriculum'>Common Sense Media</span>
                  <span className='class-dates'>2016</span>
                </a>
              </li>
        {/* </ul>

            <ul className='list-tiles other-hs-classes'> */}
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Algebra 1A</span>
                  <span className='class-curriculum'>Holt Algebra</span>
                  <span className='class-dates'>2017</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Earth Science B</span>
                  <span className='class-curriculum'>Holt Earth Science</span>
                  <span className='class-dates'>2017</span>
                </a>
              </li>
            </ul>
            </div>
              <div className='esl-classes'>
                <h3 className='section-subtitle'><i className='fa fa-language'></i> ESL</h3>
            <ul className='list-tiles esl-classes-list'>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Freshmen Conversation</span>
                  <span className='class-curriculum'>Beginner, Intermediate, Advanced</span>
                  <span className='class-dates'>2010-present</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Sophomore Conversation</span>
                  <span className='class-curriculum'>Beginner, Intermediate</span>
                  <span className='class-dates'>2010-present</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Speech &amp; Drama</span>
                  <span className='class-curriculum'>Speaking of Speech</span>
                  <span className='class-dates'>2010-present</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='https://practicalenglishwriting.com'>
                  <span className='class-name'>Reading &amp; Writing</span>
                  <span className='class-curriculum'>Practical English Series</span>
                  <span className='class-dates'>2016</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Screen English</span>
                  <span className='class-curriculum'>Extr@</span>
                  <span className='class-dates'>2010-present</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Business English</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>IETTP Teacher Training</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>IETTP Drama</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>IETTP Debate</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>TOEFL Writing &amp; Reading</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Middle / High School ESL Debate</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
              <li className='list-tile-item'>
                <a href='' disabled>
                  <span className='class-name'>Summer / Winter ESL camps</span>
                  <span className='class-curriculum'>Elementary, Middle, High school</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li>
        {/* <li className='list-tile-item'>
                <a href=''>
                  <span className='class-name'>Kindergarten ESL</span>
                  <span className='class-curriculum'>TESOL Speaking</span>
                  <span className='class-dates'>2010</span>
                </a>
              </li> */}
            </ul>
              </div>
            </div>
          </section>
  )
}
 
export default Classes