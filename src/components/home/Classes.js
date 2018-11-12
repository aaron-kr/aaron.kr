import React from 'react'
import './Classes.css'
import { obj2arr } from '../../utils/helpers'
import { classes } from '../../utils/_DATA'

const Classes = () => {
  let classArr = obj2arr( classes )
  let techClasses = classArr.filter((c) => { return c.subject === 'technology' })
  let eslClasses = classArr.filter((c) => { return c.subject === 'esl' })

  return (
    <section id='classes' className='main-section container'>
      <h2 className='section-title'>Classes</h2>
      <div className='classes-section'>

      { /* Tech Classes */ }
      <div className='tech-classes'>
        <h3 className='section-subtitle'><i className='fa fa-language'></i> {techClasses[0].subject}</h3>
        <ul className='list-tiles tech-classes-list'>
      
        { techClasses.map((theClass) => (
          
          <li key={theClass.id} className='list-tile-item'>
            <a href={theClass.url}>
              <span className='class-name'>{theClass.title}</span>
              <span className='class-curriculum'>{theClass.curriculum}</span>
              <span className='class-dates'>{theClass.dates}</span>
            </a>
          </li>

        ))}
        </ul>
      </div>

      { /* ESL Classes */ }
      <div className='esl-classes'>
        <h3 className='section-subtitle'><i className='fa fa-language'></i> {eslClasses[0].subject}</h3>
        <ul className='list-tiles esl-classes-list'>
      
        { eslClasses.map((theClass) => (
          
          <li key={theClass.id} className='list-tile-item'>
            <a href={theClass.url}>
              <span className='class-name'>{theClass.title}</span>
              <span className='class-curriculum'>{theClass.curriculum}</span>
              <span className='class-dates'>{theClass.dates}</span>
            </a>
          </li>

        ))}
        </ul>
      </div>
      
      </div>
    </section>
  )
}
 
export default Classes