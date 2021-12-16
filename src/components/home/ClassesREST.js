import React, {useEffect, useState} from 'react'
import './About.css'
import Skeleton from 'react-loading-skeleton'

export default function ClassesREST() {
  const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`https://aaron.kr/content/wp-json/wp/v2/pages/31343`)
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
    
    <section id='about' className='main-section container'>
			<h2 className='section-title'>Classes</h2>

			{Object.keys(posts).length > 0 ? (
				<div dangerouslySetInnerHTML={{__html: posts.content.rendered}}>
        </div>
			) : (
				<Skeleton count={10} />
			)}

    </section>
  )
}
