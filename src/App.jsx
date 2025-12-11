import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ListsPage from './pages/ListsPage'
import ListDetailPage from './pages/ListDetailPage'
import { AppProvider } from './context/AppContext'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ListsPage />} />
          <Route path="/list/:listId" element={<ListDetailPage />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}