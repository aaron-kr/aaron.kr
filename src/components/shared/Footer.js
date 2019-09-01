import React from 'react'
import './Footer.css'

const Footer = () => {
  let today = new Date();
  return (
    <footer className='site-footer'>
      <p className='copyright'>&copy; {today.getFullYear()} Aaron Snowberger</p>
    </footer>
  )
}
 
export default Footer