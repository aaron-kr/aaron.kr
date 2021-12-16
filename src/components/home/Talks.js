import React from 'react'
import './Talks.css'
import { obj2arr, formatDate } from '../../utils/helpers'
import talks from '../../data/_talks'

const Talks = () => {
  let talkArr = obj2arr( talks ).reverse() // make sure most recent is first

  return (
    <section id='talks' className='main-section container'>
      <h2 className='section-title'>Latest Talks (OLD)</h2>

      <ul className='list-index'><span className='list-index-date'>2018</span>
        <li className='latest-talk list-index-item list-index-new'>
          <a href={talkArr[0].notesUrl}>
            <img className='latest-talk-image' src={talkArr[0].img} alt={talkArr[0].title} />
            <span className='talk-title'>{talkArr[0].title}</span>
            { talkArr[0].subtitle && <span className='talk-subtitle'>{talkArr[0].subtitle}<br /></span> }
            <span className='talk-location'>{talkArr[0].event}</span>
            <span className='talk-date'>{formatDate(talkArr[0].date, true)}</span>
          </a>
        </li>

        { talkArr.slice(1).map((talk, i) => (
          <li key={talk.id} className='list-index-item'>
            <a href={talk.notesUrl}>
              <span className='talk-title'>{talk.title}</span>
              { talk.subtitle && 
                <span className='talk-subtitle'>{talk.subtitle}<br /></span>
              }
              <span className='talk-location'>{talk.event}</span>
              <span className='talk-date'>{formatDate(talk.date, true)}</span>
            </a>
          </li>
        ))}
              
      </ul>
    </section>
  )
}
 
export default Talks