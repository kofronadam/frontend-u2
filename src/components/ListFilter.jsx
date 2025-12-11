import React from 'react'

export default function ListFilter({ 
  filterText, 
  setFilterText, 
  filterOwner, 
  setFilterOwner,
  currentUser 
}) {
  return (
    <div className="list-filter">
      <div className="filter-row">
        <input
          type="text"
          placeholder="Hledat podle názvu..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="filter-input"
        />
        
        <select
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
          className="filter-select"
        >
          <option value="all">Všechny seznamy</option>
          {currentUser && (
            <>
              <option value="mine">Moje seznamy</option>
              <option value="shared">Sdílené se mnou</option>
            </>
          )}
        </select>
      </div>
    </div>
  )
}