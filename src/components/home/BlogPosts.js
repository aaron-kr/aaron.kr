import React, { useEffect, useState } from 'react'
import './BlogPosts.css'
import Skeleton from 'react-loading-skeleton'

export default function Posts({site_url, num_posts, orderby = 'desc'}) {
	const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`${site_url}/wp-json/wp/v2/posts/?per_page=${num_posts}&?orderby=${orderby}`)
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

			{ posts.length > 0 ? (

				<ul className='blog-boxes container large'>
							
					{posts.map((post, i) => (
						<li key={i} className='list-box-item'>
							<a href={post.link}>
								<figure className="effect">
									<img src={post.jetpack_featured_media_url} alt={post.title.rendered} />
								</figure>
								<h3 dangerouslySetInnerHTML={{__html: post.title.rendered}} />
							</a>
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

		</section>
	)
}