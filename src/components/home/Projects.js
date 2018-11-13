import React from 'react'
import './Projects.css'
import { obj2arr } from '../../utils/helpers'
import projects from '../../data/_projects'

const Projects = () => {
  let projectArr = obj2arr( projects )

  return (
    <section id='projects' className='main-section'>
      <h2 className='section-title container'>Projects</h2>
      <ul className='list-boxes container large'>

        { projectArr.map((project) => (

          <li key={project.id} className='list-box-item'>
            <figure className="effect">
              <img src={project.img} alt={project.title} />
              <figcaption>
                <h3 className='project-title'>{project.title}</h3>
                <p className='project-description'>{project.description}</p>
                <p className='project-tags'><strong>Tags:</strong><br />{project.tags}</p>
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