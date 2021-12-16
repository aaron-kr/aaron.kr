import React from 'react'
import './Classes.css'
import { obj2arr } from '../../utils/helpers'
import classes from '../../data/_classes'

const Classes = () => {
  let classArr = obj2arr( classes )
  let codeClasses = classArr.filter((c) => c.discipline === 'coding' )
  let techClasses = classArr.filter((c) => c.discipline !== 'coding' && c.subject === 'technology' )
  // let eslClasses = classArr.filter((c) => c.subject === 'esl' )

  return (
    <section id='classes' className='main-section container'>
      <h2 className='section-title'>Classes (OLD)</h2>
      <div className='classes-section'>

      { /* Coding Classes */ }
      <div className='tech-classes'>
        <h3 className='section-subtitle'><i className='fa fa-keyboard'></i> {codeClasses[0].discipline}</h3>
        <ul className='list-tiles tech-classes-list'>
      
        { codeClasses.map((theClass) => (
          
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

      { /* Other Tech Classes */ }
      <div className='tech-classes'>
        <h3 className='section-subtitle'><i className='fa fa-desktop'></i> {techClasses[0].subject}</h3>
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
      
      </div>
    </section>
  )
}
 
export default Classes