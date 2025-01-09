// src/Shell.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
// import UserProfile from './../../components/UserProfile';

import { Dashboard } from './dashboard';
import { PromptEdit } from './prompts';

import { DeliverableList } from './deliverables';
import { DocumentList } from './documents';
import { InvoiceList, InvoiceCreate, InvoiceEdit } from './invoices';
import { MilestoneList } from './milestones';
import { MSAList, MSACreate, MSAEdit } from './msas';
import { SOWList, SOWCreate, SOWEdit } from './sows';
import { VendorList, VendorCreate, VendorEdit } from './vendors';

const Shell = ({ isDarkTheme }) => {
  //const userName = "John Doe"; // Replace with actual user name
  //const userAvatar = "user-avatar.svg"; // Replace with actual avatar URL

  useEffect(() => {
    const handleResize = () => {
      const sidebarMenu = document.getElementById('sidebarMenu');
      if (!sidebarMenu.classList.contains('offcanvas')) { //window.innerWidth >= 768) {
        sidebarMenu.classList.remove('collapse');
        sidebarMenu.classList.remove('show');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const navLinks = document.querySelectorAll('#sidebarMenu .nav-link');
    const hideSidebar = () => {
      const sidebarMenu = document.getElementById('sidebarMenu');
      sidebarMenu.classList.remove('show');
    };
    navLinks.forEach(link => {
      link.addEventListener('click', hideSidebar);
    });
    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', hideSidebar);
      });
    };
  }, []);

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 p-0">
            <div className={`sidebar offcanvas-md offcanvas-start ${isDarkTheme ? 'bg-dark text-white' : 'bg-light text-dark'}`} id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
              <div className="offcanvas-header">
              </div>
              <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/" end>
                      <i className="fas fa-home"></i> Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/documents">
                      <i className="fas fa-file-alt"></i> Documents
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/invoices">
                      <i className="fas fa-file-invoice"></i> Invoices
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/msas">
                      <i className="fas fa-building"></i> MSAs
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/sows">
                      <i className="fas fa-file-contract"></i> SOWs
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/vendors">
                      <i className="fas fa-briefcase"></i> Vendors
                    </NavLink>
                  </li>
                </ul>
                <hr />
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                  Settings
                </h6>
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <NavLink className="nav-link d-flex align-items-center gap-2" to="/prompts">
                      <i className="fas fa-cog"></i> Prompts
                    </NavLink>
                  </li>
                </ul>
                {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                  Reports
                  <button type="button" className="btn btn-sm btn-outline-secondary" title="New Report">
                    <i className="fas fa-plus"></i>
                  </button>
                </h6>
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2" href="#">
                      <i className="fas fa-chart-line"></i> Current month
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2" href="#">
                      <i className="fas fa-chart-line"></i> Last quarter
                    </a>
                  </li>
                </ul>
                <hr className="my-3" /> */}
              </div>
              {/* <div className="sidebar-sticky-bottom pt-3">
                <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2" to="#">
                      <i className="fas fa-cog"></i> Settings
                    </a>
                  </li>
                  <li className='nav-item'>
                    <UserProfile name={userName} avatar={userAvatar} />
                  </li>
                </ul>               
              </div> */}
            </div>
          </div>
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentList />} />
              <Route path="/prompts" element={<PromptEdit />} />
              
              <Route path="/deliverables" element={<DeliverableList />} />

              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/create" element={<InvoiceCreate />} />
              <Route path="/invoices/:id" element={<InvoiceEdit />} />

              <Route path="/milestones" element={<MilestoneList />} />

              <Route path="/msas" element={<MSAList />} />
              <Route path="/msas/create" element={<MSACreate />} />
              <Route path="/msas/:id" element={<MSAEdit />} />
              
              <Route path="/sows" element={<SOWList />} />
              <Route path="/sows/create" element={<SOWCreate />} />
              <Route path="/sows/:id" element={<SOWEdit />} />

              <Route path="/vendors" element={<VendorList />} />
              <Route path="/vendors/create" element={<VendorCreate />} />
              <Route path="/vendors/:id" element={<VendorEdit />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default Shell;