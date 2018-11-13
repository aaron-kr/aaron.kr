import React from 'react'
import './Education.css'

const Education = () => {
  return (
    <section id='education' className='main-section container'>
      <h2 className='section-title'>Education</h2>
      <div className='school'>
        <div className="school-meta">
          <h3 className="school-name">Udacity</h3>
          <p className="school-dates">2018</p>
        </div>
        <div className="school-details">
          <p className="school-subject"><strong>React Nanodegree</strong></p>
          <p className="school-subject-details">• React MyReads web app - utilizing a web API to load, search, and save book data<br />
• React + Redux Would You Rather? web app - including User submitted questions and Leaderboard<br />
• React Native Flashcards mobile app - for creating flashcards, decks of cards, and quizzing on them</p>
          <a className="school-link" href="">Online</a>
        </div>
      </div>
    </section>
  )
}
 
export default Education