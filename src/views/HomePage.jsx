"use client"

import Menu from "../components/Menu"
import Gallery from "../components/Gallery"
import About from "../components/About"
import Hero from "../components/Hero"

const HomePage = () => {
  return (
    <div>
      <Hero />
      <div className="section-divider"></div>
      <About />
      <div className="section-divider"></div>
      <Menu />
      <div className="section-divider"></div>
      <Gallery />
    </div>
  )
}

export default HomePage