import React, {useState, useEffect} from 'react'
import './Projects.css'
import Skeleton from 'react-loading-skeleton'
// import { obj2arr } from '../../utils/helpers'
// import projects from '../../data/_projects'
// import MyLinks from '../shared/MyLinks';

export default function ProjectsREST({num_posts}) {
  const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`https://aaronsnowberger.com/wp-json/wp/v2/jetpack-portfolio?_embed&per_page=${num_posts}`)
			if ( ! response.ok ) {
				// oops! something went wrong
				return
			}

			const posts = await response.json();
			setPosts(posts)
		}

		loadPosts();
	}, [])

  return (
    <section id='projects' className='main-section'>
      <h2 className='section-title container'>Latest Design Projects</h2>

      { posts.length > 0 ? (

        <ul className='list-boxes container large'>

          { posts.map((project, i) => (

            <li key={i} className='list-box-item'>
              <figure className="effect">
                <img src={project._embedded['wp:featuredmedia']['0'].source_url} alt={project.title.rendered} />
                <figcaption>
                  <h3 className='project-title'  dangerouslySetInnerHTML={{__html: project.title.rendered}} />
                  <p className='project-description' dangerouslySetInnerHTML={{__html: project.excerpt.rendered}} />
                  <p className='project-tags'>
                    <strong>Tags:</strong><br />
                    {project.tags}
                  </p>
                  <a className="visit" href={project.link} target="_blank" rel="noopener noreferrer">Visit site</a>
                  <span className="icon"><i className="fa fa-share"></i></span>
                </figcaption>
              </figure>
            </li>
          ))}

        </ul>

        ) : (
          <ul className='blog-boxes container large center'>
            <li className='list-box-item'>
              <Skeleton height={200} width={315} />
            </li>
            <li className='list-box-item'>
              <Skeleton height={200} width={315} />
            </li>
            <li className='list-box-item'>
              <Skeleton height={200} width={315} />
            </li>
            <li className='list-box-item'>
              <Skeleton height={200} width={315} />
            </li>
          </ul>
        )}
        
      

      {/* <div className='list-icons-container'>
        <p><strong>Projects built with: </strong></p>
        <MyLinks links={uniqueIcons} />
        {/* <ul className='list-icons'>
          {uniqueIcons.map((icon,i) => 
            <li key={i} className='list-icons-item'><i className={icon}></i></li>
          )}
        </ul>}
      </div> */}
    </section>
  )
}
