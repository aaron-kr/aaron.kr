import React from 'react'

const MyLinks = (props) => {
  return (
    <ul className='my-links'>
      { props.links.map((link) => (
        <li key={link.id || link} className='my-link'>
          { link.url &&
            <a href={link.url}>
              { link.fa &&
                <i className={link.fa} style={{color: (link.colorAlt || link.color) }}></i>
              }
              { !link.fa && link.img &&
                <img className='links-icon' src={link.img} alt='' />
              }
              <p className='my-link-name'>{link.name}</p>
            </a>
          }

          { !link.url &&
            <span>
              <i className={link} style={{color: (link.colorAlt || link.color) }}></i>
              <p className='my-link-name'>{link.substr(
                link.indexOf('-') + 1, 1).toUpperCase() + 
                link.substring( link.indexOf('-') + 2)}</p>
            </span>
          }
        </li>
      ))}
    </ul>
  )
}

export default MyLinks