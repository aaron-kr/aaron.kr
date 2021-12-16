import React, { useEffect, useState } from 'react'
import './Talks.css'
import { formatDate } from '../../utils/helpers'
import Skeleton from 'react-loading-skeleton'
// import talks from '../../data/_talks'

export default function TalksREST() {
  // let talkArr = obj2arr( talks ).reverse() // make sure most recent is first
  const [ posts, setPosts ] = useState([])
	useEffect(() => {
		async function loadPosts() {
			const response = await fetch(`https://aaron.kr/content/wp-json/wp/v2/posts/?categories=8&per_page=50`)
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
      <h2 className='section-title'>Latest Talks</h2>

      { posts.length > 0 ? (

        <ul className='list-index'>
          { posts.map((talk, i) => (

            i === 0 ?

            <li key={i} className='latest-talk list-index-item list-index-new'>
              <a href={talk.link}>
                <img className='latest-talk-image' src={talk.jetpack_featured_media_url} alt={talk.title.rendered} />
                <span className='talk-title' dangerouslySetInnerHTML={{__html: talk.title.rendered}} />
                { talk.acf.subtitle &&
                  <span className='talk-subtitle'>{talk.acf.subtitle}<br /></span>
                }
                { talk.acf.location &&
                  <span className='talk-location'>{talk.acf.location}</span>
                }
                <span className='talk-date'>{formatDate(talk.date)}</span>
              </a>
            </li>

            :

            <li key={i} className='list-index-item'>
              <a href={talk.link}>
                <span className='talk-title' dangerouslySetInnerHTML={{__html: talk.title.rendered}} />
                { talk.acf.subtitle && 
                  <span className='talk-subtitle'>{talk.acf.subtitle}<br /></span>
                }
                { talk.acf.location &&
                  <span className='talk-location'>{talk.acf.location}</span>
                }
                <span className='talk-date'>{formatDate(talk.date)}</span>
              </a>
            </li>
          ))}
                
        </ul>
      ) : (
        <Skeleton count={10} />
      )}
    </section>
  )
}
