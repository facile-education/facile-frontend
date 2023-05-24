import { CLASSTEACHER, STUDENT } from '../../support/constants'
const url = '/nero/accessManager'
const helpTestMenu = [
  {
    name: 'Tableau de bord',
    items: [
      {
        name: 'Présentation',
        article: {
          hasVideo: true,
          manualContent: 'Ceci est la présentation du tableau de bord',
          questions: [
            {
              question: 'Ceci est une question fréquente',
              answer: 'Ceci est une réponse tout aussi fréquente'
            }
          ],
          related: ['Création d\'une actualité', 'Consulter une actualité'],
          links: [{ label: 'Ceci est un lien externe', url: 'https://www.weprode.com/' }]
        }
      },
      { name: 'Création d\'une actualité' },
      { name: 'Consulter une actualité' },
      { name: 'Délégation de création d\'actualité' }
    ]
  },
  {
    name: 'Mes documents',
    items: [
      {
        name: 'Présentation',
        article: {
          hasVideo: true,
          manualContent: 'Pour accéder au service de l’espace documentaire',
          questions: [],
          related: [],
          links: []
        }
      },
      { name: 'Organiser son espace' },
      { name: 'Libre Office' },
      { name: 'Enregistrement audio' },
      { name: 'Scratch' },
      { name: 'Carte mentale' },
      { name: 'Geogebra' }
    ]
  },
  {
    name: 'Droits de communication',
    items: [
      { name: 'Communication interne' }
    ]
  }
]

const helpSearchResultsMenu = [
  {
    name: 'Tableau de bord',
    items: [
      { name: 'Création d\'une actualité' }
    ]
  },
  {
    name: 'Mes documents',
    items: [
      { name: 'Enregistrement audio' }
    ]
  }
]

const helpAdminResultMenu = [
  {
    name: 'Tableau de bord',
    items: [
    ]
  },
  {
    name: 'Mes documents',
    items: [
    ]
  },
  {
    name: 'Droits de communication',
    items: [
    ]
  }
]

const categoryToCreate = {
  name: 'Ma nouvelle catégorie',
  service: { label: 'Cortex', id: 11642719 },
  items: [
    {
      name: 'Mon nouvel article!',
      role: { label: 'Maître', concernedUser: CLASSTEACHER, notConcernedUser: STUDENT }
    },
    {
      name: 'Mon deuxième nouvel article!',
      role: { label: 'Roles (laisser vide pour tous)' }
    }
  ]
}

export {
  url,
  helpTestMenu,
  helpSearchResultsMenu,
  helpAdminResultMenu,
  categoryToCreate
}
