import React from 'react'
import './Projects.css'
import { obj2arr } from '../../utils/helpers'
import projects from '../../data/_projects'
import MyLinks from '../shared/MyLinks';

const Projects = () => {
  let projectArr = obj2arr( projects )
  let uniqueIcons = [...new Set(projectArr.map(item => item.tagsVisual))]

  return (
    <section id='projects' className='main-section'>
      <h2 className='section-title container'>Projects</h2>
      <ul className='list-boxes container large'>

        { projectArr.map((project) => project.status === 'hidden' ? '' : (

          <li key={project.id} className='list-box-item'>
            <figure className="effect">
              <img src={project.img} alt={project.title} />
              <figcaption>
                <h3 className='project-title'><i className={project.tagsVisual}></i> {project.title}</h3>
                <p className='project-description'>{project.description}</p>
                <p className='project-tags'>
                  <strong>Tags:</strong><br />
                  {project.tags}
                </p>
                <a className="visit" href={project.url} target="_blank" rel="noopener noreferrer">Visit site</a>
                <span className="icon"><i className="fa fa-share"></i></span>
              </figcaption>
            </figure>
          </li>

        ))}
        
      </ul>

      <div className='list-icons-container'>
        <p><strong>Projects built with: </strong></p>
        <MyLinks links={uniqueIcons} />
        {/* <ul className='list-icons'>
          {uniqueIcons.map((icon,i) => 
            <li key={i} className='list-icons-item'><i className={icon}></i></li>
          )}
        </ul> */}
      </div>
    </section>
  )
}
 
export default Projects