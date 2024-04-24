import React from 'react'
import Banner from "../Components/Banner/Banner.js"
import CoinsTable from '../Components/CoinsTable.js'
import Footer from '../Components/Footer.js'
import { Link } from 'react-router-dom'


const Homepage = () => {
  return (
    <>
      <Banner />
      <CoinsTable />
      
    </>
  )
}

export default Homepage
