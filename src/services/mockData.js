// Mock data pro development
export const mockLists = [
  {
    id: 'list-1',
    name:  'Nákup do Tesca',
    owner: 'jan. novak',
    members: ['marie.svoboda', 'petr.dvorak'],
    items: [
      {
        id: 'item-1',
        text: 'Mléko 1L',
        done: false,
        addedBy: 'jan.novak',
        ts: Date.now() - 3600000
      },
      {
        id: 'item-2',
        text: 'Chléb celozrnný',
        done: true,
        addedBy: 'marie.svoboda',
        ts: Date.now() - 7200000
      },
      {
        id: 'item-3',
        text: 'Máslo 250g',
        done: false,
        addedBy: 'petr.dvorak',
        ts: Date.now() - 1800000
      },
      {
        id: 'item-4',
        text: 'Jogurt bílý',
        done: true,
        addedBy: 'jan.novak',
        ts: Date.now() - 14400000
      }
    ],
    accessRequests: [
      {
        id: 'req-1',
        username: 'anna.kratka',
        message: 'Ahoj, můžu se přidat k nákupu?  Bydlím ve stejné čtvrti.',
        timestamp: Date.now() - 900000
      }
    ]
  },
  {
    id: 'list-2',
    name: 'Dárky k Vánocům',
    owner: 'marie.svoboda',
    members: ['jan.novak'],
    items: [
      {
        id: 'item-5',
        text: 'Kniha pro mamu - Haruki Murakami',
        done: false,
        addedBy: 'marie.svoboda',
        ts: Date.now() - 5400000
      },
      {
        id: 'item-6',
        text: 'Hračka pro Tomáška - LEGO',
        done: true,
        addedBy: 'jan. novak',
        ts: Date.now() - 10800000
      },
      {
        id: 'item-7',
        text: 'Parfém pro sestru',
        done: false,
        addedBy: 'marie. svoboda',
        ts: Date.now() - 7200000
      }
    ],
    accessRequests: []
  },
  {
    id: 'list-3',
    name: 'Víkendový výlet - Krkonoše',
    owner:  'petr.dvorak',
    members: ['jan.novak', 'marie. svoboda', 'anna.kratka'],
    items: [
      {
        id:  'item-8',
        text: 'Stan 4 osoby',
        done: true,
        addedBy: 'petr.dvorak',
        ts: Date.now() - 14400000
      },
      {
        id: 'item-9',
        text: 'Spací pytle',
        done: false,
        addedBy: 'anna.kratka',
        ts: Date.now() - 3600000
      },
      {
        id: 'item-10',
        text: 'Vařič a nádobí',
        done: true,
        addedBy: 'jan.novak',
        ts: Date.now() - 9000000
      },
      {
        id: 'item-11',
        text: 'Mapa Krkonoš',
        done: false,
        addedBy: 'marie.svoboda',
        ts: Date.now() - 1800000
      }
    ],
    accessRequests: []
  },
  {
    id: 'list-4',
    name: 'Domácí projekty',
    owner: 'anna.kratka',
    members: [],
    items: [
      {
        id: 'item-12',
        text: 'Vymalovat obývák',
        done: false,
        addedBy: 'anna.kratka',
        ts: Date.now() - 86400000
      },
      {
        id: 'item-13',
        text: 'Opravit kapající kohoutek',
        done: true,
        addedBy: 'anna.kratka',
        ts: Date.now() - 172800000
      }
    ],
    accessRequests: [
      {
        id: 'req-2',
        username: 'petr.dvorak',
        message: 'Rád bych pomohl s malováním! ',
        timestamp: Date.now() - 7200000
      }
    ]
  }
];

export const mockUsers = [
  'jan.novak',
  'marie.svoboda', 
  'petr.dvorak',
  'anna.kratka',
  'tomas.vesely',
  'lucka.novotna',
  'pavel.svoboda'
];

export const mockNotifications = [
  {
    id: 'notif-1',
    type:  'access_request',
    listId: 'list-1',
    listName: 'Nákup do Tesca',
    fromUser: 'anna.kratka',
    message: 'Ahoj, můžu se přidat k nákupu? Bydlím ve stejné čtvrti.',
    timestamp: Date.now() - 900000,
    read:  false
  },
  {
    id: 'notif-2',
    type: 'access_request',
    listId: 'list-4',
    listName: 'Domácí projekty',
    fromUser: 'petr.dvorak',
    message: 'Rád bych pomohl s malováním!',
    timestamp: Date.now() - 7200000,
    read: false
  }
];