import React, { Component } from 'react'
import './App.css'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import Intro from './components/home/Intro'
import Talks from './components/home/Talks'
import Classes from './components/home/Classes'
import Projects from './components/home/Projects'
import About from './components/home/About'
import Education from './components/home/Education'

class App extends Component {
  render() {
    return (
      <div className='site'>
        <Header />
        <main className='site-main' role='main'>
          <Intro />
          <Talks />
          <Classes />
          <Projects />
          <About />
          <Education />
        </main>
        <Footer />
      </div>
    )
  }
}

export default App
