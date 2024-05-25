//import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { 
  HashRouter,
  Outlet, 
  Route, Routes
} from 'react-router-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import './index.css'

import { MainApp } from './MainApp.jsx'
import { Technical } from './pages/Technical.jsx'
import About from './pages/About.jsx'
import Guide from './pages/Guide.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Layout />} exact>
          <Route index element={<MainApp />}/>
          <Route path=':country' element={<MainApp />}>
            <Route path=':indicator' element={<MainApp />}></Route>
          </Route>
          <Route path='about' element={<About/>}/>
          <Route path='guide' element={<Guide/>}/>
          <Route path='technote-1' element={<Technical which='boundary'/>}/>
          <Route path='technote-2' element={<Technical which='change'/>}/>
        </Route>
      </Routes>
    </HashRouter>
  )
}

function Layout() {
  return (
    <div>
      <div className='shadow mb-2'>
        <div className='container-xl px-2'>
          <Navbar expand='md'>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav>
                <Nav.Link href='./'><i className='pi pi-home mx-1'></i>Home</Nav.Link>
                <Nav.Link href='#/about'><i className='pi pi-info-circle mx-1'></i>About</Nav.Link>
                <Nav.Link href='#/guide'><i className='pi pi-question-circle mx-1'></i>Guide</Nav.Link>
                <NavDropdown title={<span><i className='pi pi-question-circle mx-1'></i>Technical Note</span>}>
                  <NavDropdown.Item href='#/technote-1'>Technical Note 1</NavDropdown.Item>
                  <NavDropdown.Item href='#/technote-2'>Technical Note 2</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <Navbar className='justify-content-end'>
              <Nav>
                <Nav.Link href='/temporary/'><i className='pi pi-sign-out mx-1'></i>Logout</Nav.Link>
              </Nav>
            </Navbar>
          </Navbar>
        </div>
      </div>

      <div className='container-xl px-2' style={{paddingBottom:'50px'}}>
        <Outlet/>
      </div>

      <div className='shadow fixed-bottom p-2 justify-content-end'>
        &copy; 2024 <a href='https://sdi.worldpop.org'>WorldPop SDI</a>
      </div>
    </div>
  )
}