import React, { useEffect, useState, useMemo } from 'react'
import Lists from './components/Lists'
import Members from './components/Members'
import Items from './components/Items'
import Modal from './components/Modal'

const STORAGE_KEY = 'shopping_list_vite_v2'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const makeList = ({ name = 'Nový seznam', owner = null, members = [], items = [] } = {}) => ({
  id: uid(),
  name,
  owner,
  members,
  items
})

// IMPORTANT: start with no users and no lists
const defaultModel = {
  lists: [],               // žádné seznamy při prvním startu
  selectedListId: null,    // žádné vybrané id
  currentUser: null        // žádný přihlášený uživatel
}

function loadModel() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultModel }
    const parsed = JSON.parse(raw)

    // migrate old shape (shopping_list_vite_v1) -> new shape
    if (parsed.listName && !parsed.lists) {
      const legacyList = makeList({
        name: parsed.listName || 'Seznam',
        owner: parsed.owner || null,
        members: parsed.members || [],
        items: parsed.items || []
      })
      return { lists: [legacyList], selectedListId: legacyList.id, currentUser: parsed.currentUser || null }
    }

    return {
      ...defaultModel,
      ...parsed,
      selectedListId: parsed.selectedListId || (parsed.lists && parsed.lists[0] && parsed.lists[0].id) || null
    }
  } catch (e) {
    console.warn('Chyba při načítání localStorage', e)
    return { ...defaultModel }
  }
}

export default function App() {
  const [model, setModel] = useState(() => loadModel())
  const [usernameInput, setUsernameInput] = useState('')

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(model))
    } catch (e) {
      console.warn('Chyba při ukládání', e)
    }
  }, [model])

  // derived
  const lists = model.lists || []
  const selectedListId = model.selectedListId || (lists[0] && lists[0].id) || null
  const currentList = lists.find(l => l.id === selectedListId) || null

  // ensure we set a selectedListId if there are lists but none selected
  useEffect(() => {
    if (!model.selectedListId && lists[0]) {
      setModel(prev => ({ ...prev, selectedListId: lists[0].id }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isOwner = currentList && model.currentUser && model.currentUser === currentList.owner
  const isMember = currentList && model.currentUser && currentList.members.includes(model.currentUser)

  // list actions
  function createList(name) {
    if (!model.currentUser) {
      alert('Přihlas se, abys mohl vytvořit seznam.')
      return
    }
    const owner = model.currentUser
    const list = makeList({ name: name || `${owner}ův seznam`, owner, members: [owner], items: [] })
    setModel(prev => ({ ...prev, lists: [list, ...prev.lists], selectedListId: list.id }))
  }

  function selectList(id) {
    setModel(prev => ({ ...prev, selectedListId: id }))
  }

  function renameCurrentList(newName) {
    if (!currentList) return
    if (!isOwner) {
      alert('Název může upravit pouze vlastník.')
      return
    }
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, name: newName } : l))
    }))
  }

  function deleteCurrentList() {
    if (!currentList) return
    if (!confirm('Opravdu chceš smazat tento seznam? Tuto akci nelze vrátit.')) return
    setModel(prev => {
      const lists = prev.lists.filter(l => l.id !== currentList.id)
      const selectedListId = lists[0] ? lists[0].id : null
      return { ...prev, lists, selectedListId }
    })
  }

  // membership & owner operations working on currentList
  function addMemberToCurrent(name) {
    if (!currentList) return
    if (!isOwner) { alert('Pouze vlastník může přidávat členy.'); return }
    if (!name) return
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, members: l.members.includes(name) ? l.members : [...l.members, name] } : l))
    }))
  }

  function removeMemberFromCurrent(name) {
    if (!currentList) return
    if (!isOwner) return
    if (name === currentList.owner) {
      alert('Nelze odebrat vlastníka tímto tlačítkem.')
      return
    }
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, members: l.members.filter(m => m !== name) } : l))
    }))
  }

  function transferOwnershipTo(name) {
    if (!currentList) return
    if (!isOwner) return
    if (!currentList.members.includes(name)) return
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, owner: name } : l))
    }))
  }

  // user login / leave (leave affects only current list membership)
  function login(name) {
    if (!name) return
    setModel(prev => {
      // do NOT auto-create a list if there are no lists
      // only add the user into the currently selected list (if any)
      const updatedLists = prev.lists.map(l => {
        if (l.id === prev.selectedListId) {
          if (!l.members.includes(name)) return { ...l, members: [...l.members, name] }
        }
        return l
      })
      // if selected list had no owner, set this user as owner
      const updatedLists2 = updatedLists.map(l => {
        if (l.id === prev.selectedListId && !l.owner) return { ...l, owner: name }
        return l
      })
      return { ...prev, currentUser: name, lists: updatedLists2, selectedListId: prev.selectedListId }
    })
    setUsernameInput('')
    setShowLoginModal(false)
  }

  function leaveCurrentList() {
    if (!model.currentUser || !currentList) return
    if (!confirm('Opravdu chceš opustit tento nákupní seznam?')) return
    const leaving = model.currentUser
    setModel(prev => {
      const lists = prev.lists.map(l => {
        if (l.id !== currentList.id) return l
        const members = l.members.filter(m => m !== leaving)
        let owner = l.owner
        if (owner === leaving) {
          owner = members.length > 0 ? members[0] : null
        }
        return { ...l, members, owner }
      })
      return { ...prev, lists, currentUser: null }
    })
  }

  // items operations on currentList
  function addItem(text) {
    if (!currentList) { alert('Vyber seznam.'); return }
    if (!isMember) { alert('Musíš být členem seznamu, abys přidal položku.'); return }
    if (!text) return
    const item = { id: uid(), text, done: false, addedBy: model.currentUser, ts: Date.now() }
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, items: [item, ...l.items] } : l))
    }))
  }

  function toggleItemDone(id, done) {
    if (!currentList) return
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, items: l.items.map(it => (it.id === id ? { ...it, done } : it)) } : l))
    }))
  }

  function removeItem(id) {
    if (!currentList) return
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === currentList.id ? { ...l, items: l.items.filter(it => it.id !== id) } : l))
    }))
  }

  // derived helper: sort lists so selected first
  const listsSorted = useMemo(() => {
    return [...lists].sort((a, b) => (a.id === selectedListId ? -1 : a.name.localeCompare(b.name)))
  }, [lists, selectedListId])

  return (
    <div className="app">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/*Levá část hlavičky: Vlastník seznamu + Název sezamu */}
        <div>
          <h1 style={{ margin: 0 }}>{currentList ? currentList.name : 'Žádný seznam'}</h1>
          <div className="owner-badge">{currentList && currentList.owner ? `Vlastník: ${currentList.owner}` : 'Žádný vlastník'}</div>
        </div>
      
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>         
          {/* Nové pole pro přihlášeného uživatele */}
          <div className="current-user-info" style={{ fontSize: '0.95rem' }}>
            {model.currentUser ? (
              <span style={{ fontWeight: 'bold', color: '#2b7a78', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Ikona panáčka (volitelné) */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                {model.currentUser}
              </span>
            ) : (
              <span style={{ color: '#999', fontStyle: 'italic' }}>Nepřihlášen</span>
            )}
          </div>
          
        </div>
      </header>

      <section className="login">
        <input
          placeholder="Zadej své jméno (uživatel)"
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login(usernameInput.trim())}
        />
        <button onClick={() => login(usernameInput.trim())} disabled={!usernameInput.trim()}>
          Přihlásit
        </button>
        <button className="danger" onClick={leaveCurrentList} style={{ display: isMember ? 'inline-block' : 'none' }}>
          Odejít ze seznamu
        </button>
      </section>

      <Lists
        lists={listsSorted}
        selectedId={selectedListId}
        onSelect={selectList}
        onCreate={createList}
        onRenameCurrent={renameCurrentList}
        onDeleteCurrent={deleteCurrentList}
        currentList={currentList}
        currentUser={model.currentUser}
        isOwner={isOwner}
      />

      {currentList ? (
        <>
          <section className="controls">
            <Members
              members={currentList.members}
              owner={currentList.owner}
              currentUser={model.currentUser}
              onAddMember={addMemberToCurrent}
              onRemoveMember={removeMemberFromCurrent}
              onTransferOwnership={transferOwnershipTo}
              isOwner={isOwner}
            />
          </section>

          <Items
            items={currentList.items}
            currentUser={model.currentUser}
            members={currentList.members}
            onAddItem={addItem}
            onToggleDone={toggleItemDone}
            onRemoveItem={removeItem}
          />
        </>
      ) : (
        <div style={{ padding: 20, color: '#666' }}>Vyber nebo vytvoř nový seznam.</div>
      )}

      <footer>
        <small>Data se ukládají lokálně v prohlížeči (localStorage).</small>
      </footer>
    </div>
  )
}