import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="dashboard">
      <header className="header">
        <h1>Listify</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="main-content">
        <div className="content-wrapper">
          <h2>Welcome to your List</h2>
          <div className="cards">
            <div className="card">
              <h3>Total Users</h3>
              <p>1,234</p>
            </div>
            <div className="card">
              <h3>Revenue</h3>
              <p>$12,345</p>
            </div>
            <div className="card">
              <h3>Orders</h3>
              <p>567</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
