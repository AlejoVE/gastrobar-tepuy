"use client"

import Menu from "../components/Menu"
import Gallery from "../components/Gallery"
import About from "../components/About"
import Hero from "../components/Hero"

const HomePage = ({ setCurrentPage }) => {

  return (
    <div>
      {/* Hero Section */}
      <Hero setCurrentPage={setCurrentPage} />

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* About Section */}
      <About />

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Menu Section */}
      <Menu />

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Gallery Section */}
      <Gallery />
    </div>
  )
}

export default HomePage
