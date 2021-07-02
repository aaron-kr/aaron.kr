import React, { useEffect, useState } from 'react'
import './BlogPosts.css'

export default function Posts({site_url, num_posts}) {
	const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`${site_url}/wp-json/wp/v2/posts/?per_page=${num_posts}&categories=8`)
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
		<section id={`blog-posts-${site_url}`} className='main-section blog-posts-grid'>
      <ul className='blog-boxes container large'>
			
				{posts.map((post, i) => (
					<li key={i} className='list-box-item'>
					<figure className="effect">
						<img src={post.jetpack_featured_media_url} alt={post.title.rendered} />
						{/* <figcaption>
							<h3 className='project-title'><i className={project.tagsVisual}></i> {project.title}</h3>
							<p className='project-description'>{project.description}</p>
							<p className='project-tags'>
								<strong>Tags:</strong><br />
								{project.tags}
							</p>
							<a className="visit" href={project.url} target="_blank" rel="noopener noreferrer">Visit site</a>
							<span className="icon"><i className="fa fa-share"></i></span>
						</figcaption> */}
					</figure>
					<h3>{post.title.rendered}</h3>
				</li>
				))}

			</ul>
		</section>
	)
}