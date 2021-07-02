import React, {useEffect, useState} from 'react'
import './About.css'

export default function AboutREST() {
  const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`https://aaron.kr/content/wp-json/wp/v2/pages/31334`)
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

      {posts &&
        <div dangerouslySetInnerHTML={{__html: posts.content.rendered}}>
        </div>
      }

    </section>
  )
}
