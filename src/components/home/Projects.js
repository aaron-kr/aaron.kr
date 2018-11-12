import React from 'react'
import './Projects.css'
import { obj2arr } from '../../utils/helpers'
import { projects } from '../../utils/_DATA'

const Projects = () => {
  let projectArr = obj2arr( projects )

  return (
    <section id='projects' className='main-section'>
      <h2 className='section-title'>Projects</h2>
      <ul className='list-boxes'>

        { projectArr.map((project) => (

          <li key={project.id} className='list-box-item' style={{background: project.color}}>
            <figure className="effect">
              <img src={project.img} alt={project.title} />
              <figcaption>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p><strong>Tags:</strong><br />{project.tags}</p>
                <a className="visit" href={project.url} target="_blank">Visit site</a>
                <span className="icon"><i className="fa fa-share"></i></span>
              </figcaption>
            </figure>
          </li>

        ))}
        
      </ul>
    </section>
  )
}
 
export default Projects