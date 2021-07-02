import React, { useEffect, useState } from 'react'
import './Talks.css'
import { obj2arr, formatDate } from '../../utils/helpers'
// import talks from '../../data/_talks'

export default function TalksREST() {
  // let talkArr = obj2arr( talks ).reverse() // make sure most recent is first
  const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`https://aaron.kr/content/wp-json/wp/v2/posts/?categories=8&posts_per_page=200`)
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
    <section id='talks' className='main-section container'>
      <h2 className='section-title'>Latest Talks (REST)</h2>

      <ul className='list-index'>
        {/* <li className='latest-talk list-index-item list-index-new'>
          <a href={posts[0].link}>
            <img className='latest-talk-image' src={posts[0].jetpack_featured_media_url} alt={posts[0].title.rendered} />
            <span className='talk-title'>{posts[0].title.rendered}</span>
            { posts[0].subtitle &&
              <span className='talk-subtitle'>{posts[0].subtitle}<br /></span>
            }
            <span className='talk-location'>{posts[0].status}</span>
            <span className='talk-date'>{formatDate(posts[0].date, true)}</span>
          </a>
        </li> */}

        { posts.map((talk, i) => (
          i !== 0 &&
          <li key={i} className='list-index-item'>
            <a href={talk.link}>
              <span className='talk-title'>{talk.title.rendered}</span>
              { talk.subtitle && 
                <span className='talk-subtitle'>{talk.subtitle}<br /></span>
              }
              <span className='talk-location'>{talk.status}</span>
              <span className='talk-date'>{formatDate(talk.date, true)}</span>
            </a>
          </li>
        ))}
              
      </ul>
    </section>
  )
}
