// Fichier de données de test
// Vous pouvez sauvegarder ce fichier en tant que testData.js et l'importer dans votre composant

// Données utilisateurs
const users = [
    {
      id: 1,
      name: "Administrateur",
      email: "admin@example.com",
      role: "admin",
      confirmed: true,
      created_at: "2025-01-15T08:30:00.000Z"
    },
    {
      id: 2,
      name: "Jean Dupont",
      email: "jean@example.com",
      role: "user",
      confirmed: true,
      created_at: "2025-02-12T14:22:00.000Z"
    },
    {
      id: 3,
      name: "Marie Laurent",
      email: "marie@example.com",
      role: "user",
      confirmed: true,
      created_at: "2025-03-05T11:45:00.000Z"
    },
    {
      id: 4, 
      name: "Ahmed Riad",
      email: "ahmed@example.com",
      role: "user",
      confirmed: true,
      created_at: "2025-03-18T09:15:00.000Z"
    },
    {
      id: 5,
      name: "Sophie Martin",
      email: "sophie@example.com",
      role: "user",
      confirmed: false,
      created_at: "2025-04-10T16:05:00.000Z"
    },
    {
      id: 6,
      name: "Lucas Bernard",
      email: "lucas@example.com",
      role: "user",
      confirmed: false,
      created_at: "2025-04-15T10:30:00.000Z"
    }
  ];
  
  // Données des stades
  const stades = [
    {
      id: 1,
      nom: "Stade Municipal",
      adresse: "12 rue du Sport, 75001 Paris",
      capacite: 500,
      prix_heure: 120,
      description: "Stade polyvalent avec terrain synthétique",
      disponible: true,
      image: "stade_municipal.jpg",
      created_at: "2024-12-01T10:00:00.000Z",
      updated_at: "2025-01-10T14:30:00.000Z"
    },
    {
      id: 2,
      nom: "Complexe Sportif Central",
      adresse: "45 avenue des Champions, 75008 Paris",
      capacite: 800,
      prix_heure: 180,
      description: "Grand complexe avec terrain en gazon naturel",
      disponible: true,
      image: "complexe_central.jpg",
      created_at: "2024-12-05T11:20:00.000Z",
      updated_at: "2025-02-15T09:15:00.000Z"
    },
    {
      id: 3,
      nom: "Arena du Quartier",
      adresse: "3 boulevard Est, 75015 Paris",
      capacite: 300,
      prix_heure: 90,
      description: "Stade couvert idéal pour matchs amicaux",
      disponible: true,
      image: "arena_quartier.jpg",
      created_at: "2025-01-12T15:45:00.000Z",
      updated_at: "2025-03-01T12:00:00.000Z"
    },
    {
      id: 4,
      nom: "Terrain Olympique",
      adresse: "28 rue des Médailles, 75016 Paris",
      capacite: 1200,
      prix_heure: 250,
      description: "Terrain professionnel avec tribunes",
      disponible: false,
      image: "terrain_olympique.jpg",
      created_at: "2025-02-02T08:30:00.000Z",
      updated_at: "2025-03-20T16:45:00.000Z"
    },
    {
      id: 5,
      nom: "Stade du Parc",
      adresse: "7 allée Verte, 75019 Paris",
      capacite: 450,
      prix_heure: 110,
      description: "Terrain situé dans un environnement calme et verdoyant",
      disponible: true,
      image: "stade_parc.jpg",
      created_at: "2025-02-20T13:10:00.000Z",
      updated_at: "2025-04-05T11:30:00.000Z"
    }
  ];
  
  // Données des produits
  const products = [
    {
      id: 1,
      nom: "Ballon de football professionnel",
      description: "Ballon de compétition taille 5, qualité FIFA",
      prix: 49.99,
      stock: 85,
      categorie: "Équipement",
      image: "ballon_pro.jpg",
      created_at: "2024-12-15T09:20:00.000Z",
      updated_at: "2025-03-01T14:30:00.000Z"
    },
    {
      id: 2,
      nom: "Maillot équipe nationale",
      description: "Maillot officiel domicile, saison 2024-2025",
      prix: 89.95,
      stock: 42,
      categorie: "Vêtements",
      image: "maillot_equipe.jpg",
      created_at: "2025-01-05T11:45:00.000Z",
      updated_at: "2025-03-12T15:20:00.000Z"
    },
    {
      id: 3,
      nom: "Chaussures à crampons",
      description: "Chaussures de football pour terrains secs, pointure 39-46",
      prix: 129.50,
      stock: 28,
      categorie: "Chaussures",
      image: "chaussures_crampons.jpg",
      created_at: "2025-01-18T13:15:00.000Z",
      updated_at: "2025-03-15T10:40:00.000Z"
    },
    {
      id: 4,
      nom: "Ensemble d'entraînement",
      description: "Ensemble complet pour entraînement - shorts et maillot respirants",
      prix: 65.00,
      stock: 53,
      categorie: "Vêtements",
      image: "ensemble_entrainement.jpg",
      created_at: "2025-02-02T15:30:00.000Z",
      updated_at: "2025-04-01T09:15:00.000Z"
    },
    {
      id: 5,
      nom: "Gants de gardien professionnels",
      description: "Gants de gardien avec protection des doigts et grip optimal",
      prix: 54.99,
      stock: 17,
      categorie: "Équipement",
      image: "gants_gardien.jpg",
      created_at: "2025-02-15T10:25:00.000Z",
      updated_at: "2025-03-25T16:50:00.000Z"
    },
    {
      id: 6,
      nom: "Sac de sport club",
      description: "Grand sac avec plusieurs compartiments, logo du club",
      prix: 39.95,
      stock: 61,
      categorie: "Accessoires",
      image: "sac_sport.jpg",
      created_at: "2025-03-05T12:10:00.000Z",
      updated_at: "2025-04-10T11:05:00.000Z"
    }
  ];
  
  // Données des réservations
  const reservations = [
    {
      id: 1,
      stade_id: 1,
      user_id: 2,
      date_debut: "2025-03-15T14:00:00.000Z",
      date_fin: "2025-03-15T16:00:00.000Z",
      prix_total: 240.00,
      statut: "confirmé",
      created_at: "2025-03-01T09:45:00.000Z",
      updated_at: "2025-03-02T11:20:00.000Z"
    },
    {
      id: 2,
      stade_id: 3,
      user_id: 3,
      date_debut: "2025-03-20T10:00:00.000Z",
      date_fin: "2025-03-20T12:00:00.000Z",
      prix_total: 180.00,
      statut: "confirmé",
      created_at: "2025-03-05T14:30:00.000Z",
      updated_at: "2025-03-06T08:15:00.000Z"
    },
    {
      id: 3,
      stade_id: 2,
      user_id: 4,
      date_debut: "2025-03-25T18:00:00.000Z",
      date_fin: "2025-03-25T20:00:00.000Z",
      prix_total: 360.00,
      statut: "confirmé",
      created_at: "2025-03-10T16:20:00.000Z",
      updated_at: "2025-03-11T10:30:00.000Z"
    },
    {
      id: 4,
      stade_id: 5,
      user_id: 2,
      date_debut: "2025-04-02T15:00:00.000Z",
      date_fin: "2025-04-02T17:00:00.000Z",
      prix_total: 220.00,
      statut: "confirmé",
      created_at: "2025-03-18T11:40:00.000Z",
      updated_at: "2025-03-19T09:10:00.000Z"
    },
    {
      id: 5,
      stade_id: 1,
      user_id: 3,
      date_debut: "2025-04-10T12:00:00.000Z",
      date_fin: "2025-04-10T14:00:00.000Z",
      prix_total: 240.00,
      statut: "en attente",
      created_at: "2025-03-25T13:55:00.000Z",
      updated_at: "2025-03-25T13:55:00.000Z"
    },
    {
      id: 6,
      stade_id: 3,
      user_id: 5,
      date_debut: "2025-04-15T09:00:00.000Z",
      date_fin: "2025-04-15T11:00:00.000Z",
      prix_total: 180.00,
      statut: "en attente",
      created_at: "2025-04-01T10:15:00.000Z",
      updated_at: "2025-04-01T10:15:00.000Z"
    },
    {
      id: 7,
      stade_id: 4,
      user_id: 4,
      date_debut: "2025-04-18T16:00:00.000Z",
      date_fin: "2025-04-18T18:00:00.000Z",
      prix_total: 500.00,
      statut: "en attente",
      created_at: "2025-04-05T15:30:00.000Z",
      updated_at: "2025-04-05T15:30:00.000Z"
    }
  ];
  
  // Données des commandes
  const orders = [
    {
      id: 1,
      user_id: 2,
      total_price: 139.94,
      status: "confirmed",
      address: "12 rue des Fleurs, 75002 Paris",
      phone: "0612345678",
      created_at: "2025-03-02T14:25:00.000Z",
      updated_at: "2025-03-03T09:15:00.000Z",
      items: [
        { product_id: 1, quantity: 2, price: 49.99 },
        { product_id: 6, quantity: 1, price: 39.95 }
      ]
    },
    {
      id: 2,
      user_id: 3,
      total_price: 219.45,
      status: "confirmed",
      address: "8 avenue de la République, 75011 Paris",
      phone: "0687654321",
      created_at: "2025-03-08T11:10:00.000Z",
      updated_at: "2025-03-09T15:30:00.000Z",
      items: [
        { product_id: 2, quantity: 1, price: 89.95 },
        { product_id: 5, quantity: 1, price: 54.99 },
        { product_id: 6, quantity: 1, price: 39.95 }
      ]
    },
    {
      id: 3,
      user_id: 4,
      total_price: 259.00,
      status: "confirmed",
      address: "21 boulevard Voltaire, 75011 Paris",
      phone: "0623456789",
      created_at: "2025-03-15T16:45:00.000Z",
      updated_at: "2025-03-16T10:20:00.000Z",
      items: [
        { product_id: 3, quantity: 2, price: 129.50 }
      ]
    },
    {
      id: 4,
      user_id: 2,
      total_price: 204.94,
      status: "pending",
      address: "12 rue des Fleurs, 75002 Paris",
      phone: "0612345678",
      created_at: "2025-03-25T13:30:00.000Z",
      updated_at: "2025-03-25T13:30:00.000Z",
      items: [
        { product_id: 4, quantity: 2, price: 65.00 },
        { product_id: 5, quantity: 1, price: 54.99 },
        { product_id: 1, quantity: 1, price: 49.99 }
      ]
    },
    {
      id: 5,
      user_id: 5,
      total_price: 89.95,
      status: "pending",
      address: "5 rue du Commerce, 75015 Paris",
      phone: "0634567890",
      created_at: "2025-04-02T09:15:00.000Z",
      updated_at: "2025-04-02T09:15:00.000Z",
      items: [
        { product_id: 2, quantity: 1, price: 89.95 }
      ]
    },
    {
      id: 6,
      user_id: 3,
      total_price: 169.94,
      status: "pending",
      address: "8 avenue de la République, 75011 Paris",
      phone: "0687654321",
      created_at: "2025-04-08T14:50:00.000Z",
      updated_at: "2025-04-08T14:50:00.000Z",
      items: [
        { product_id: 1, quantity: 2, price: 49.99 },
        { product_id: 6, quantity: 1, price: 39.95 },
        { product_id: 5, quantity: 1, price: 54.99 }
      ]
    }
  ];
  
  // Données de commandes en attente (pour la vue spécifique)
  const pendingOrders = orders.filter(order => order.status === "pending");
  
  // Exportez les données
  export {
    users,
    stades,
    products,
    reservations,
    orders,
    pendingOrders
  };