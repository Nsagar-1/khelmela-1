import { connectDatabase, disconnectDatabase } from '../config/database';
import { MongoDBStorage } from '../storage/mongodb';
import { format } from 'date-fns';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await connectDatabase();
    
    const storage = new MongoDBStorage();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    
    // Seed Stats
    console.log('📊 Seeding stats...');
    const initialStats = [
      { label: "Active Players", value: "10K+", order: 1 },
      { label: "Tournaments", value: "500+", order: 2 },
      { label: "Prize Money", value: "$1M+", order: 3 },
      { label: "Game Titles", value: "20+", order: 4 },
    ];

    for (const stat of initialStats) {
      await storage.createStat(stat);
    }

    // Seed Tournaments
    console.log('🏆 Seeding tournaments...');
    const initialTournaments = [
      {
        name: "Free Fire World Cup",
        description: "The ultimate Free Fire tournament showcasing the best teams from around the world competing for glory and prizes. Prepare for intense battles and strategic gameplay!",
        game: "Free Fire",
        category: "battle-royale",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
        status: "live",
        prizePool: 15000,
        teamSize: "4v4",
        maxTeams: 64,
        registeredTeams: 45,
        startDate: new Date("2023-07-15"),
        endDate: new Date("2023-07-25"),
        rules: "Official Free Fire tournament rules apply. Full rulebook available upon registration.",
        featured: true,
        organizer: "Garena",
        location: "Online",
        entryFee: 40,
        bracket: null
      },
      {
        name: "PUBG Masters League",
        description: "The biggest PUBG tournament of the year featuring top-tier teams competing for the championship title and massive prizes.",
        game: "PUBG",
        category: "battle-royale",
        image: "https://images.unsplash.com/photo-1591497237138-a3b268458dd4?auto=format&fit=crop&q=80",
        status: "upcoming",
        prizePool: 25000,
        teamSize: "4v4",
        maxTeams: 80,
        registeredTeams: 52,
        startDate: new Date("2023-08-10"),
        endDate: new Date("2023-08-25"),
        rules: "Official PUBG tournament rules. Teams must qualify through regional preliminaries.",
        featured: true,
        organizer: "PUBG Corporation",
        location: "Los Angeles, CA",
        entryFee: 60,
        bracket: null
      },
      {
        name: "Free Fire Pro League",
        description: "Regional Free Fire tournament where the best teams battle for supremacy and a chance to qualify for international events.",
        game: "Free Fire",
        category: "battle-royale",
        image: "https://images.unsplash.com/photo-1637159840655-cb1bdf78f58a?auto=format&fit=crop&q=80",
        status: "upcoming",
        prizePool: 12000,
        teamSize: "4v4",
        maxTeams: 32,
        registeredTeams: 32,
        startDate: new Date("2023-09-05"),
        endDate: new Date("2023-09-12"),
        rules: "Standard Free Fire tournament rules apply. Map rotation includes Bermuda, Kalahari, and Purgatory.",
        featured: true,
        organizer: "Garena",
        location: "Online",
        entryFee: 35,
        bracket: null
      },
      {
        name: "PUBG Mobile Cup",
        description: "A mobile-focused PUBG tournament where skilled players compete for recognition and rewards.",
        game: "PUBG Mobile",
        category: "battle-royale",
        image: "https://images.unsplash.com/photo-1589241687575-4f2302e3156a?auto=format&fit=crop&q=80",
        status: "upcoming",
        prizePool: 8000,
        teamSize: "4v4",
        maxTeams: 48,
        registeredTeams: 30,
        startDate: new Date("2023-10-15"),
        endDate: new Date("2023-10-20"),
        rules: "Standard PUBG Mobile tournament rules apply. Points awarded for placement and kills.",
        featured: false,
        organizer: "Tencent Games",
        location: "Online",
        entryFee: 25,
        bracket: null
      },
      {
        name: "PUBG Continental Series",
        description: "Regional PUBG tournaments featuring the top teams competing for regional supremacy and international recognition.",
        game: "PUBG",
        category: "battle-royale",
        image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80",
        status: "upcoming",
        prizePool: 20000,
        teamSize: "4v4",
        maxTeams: 64,
        registeredTeams: 40,
        startDate: new Date("2023-11-10"),
        endDate: new Date("2023-11-15"),
        rules: "Standard PUBG tournament rules apply. Points awarded for placement and kills.",
        featured: false,
        organizer: "PUBG Corporation",
        location: "Online",
        entryFee: 40,
        bracket: null
      },
      {
        name: "Free Fire World Series",
        description: "The premier Free Fire tournament with competitors from all regions fighting for the championship title.",
        game: "Free Fire",
        category: "battle-royale",
        image: "https://images.unsplash.com/photo-1560253023-3ec5d502b22f?auto=format&fit=crop&q=80",
        status: "upcoming",
        prizePool: 30000,
        teamSize: "4v4",
        maxTeams: 16,
        registeredTeams: 16,
        startDate: new Date("2023-12-05"),
        endDate: new Date("2023-12-15"),
        rules: "Official Free Fire tournament rules. Teams must qualify through regional events.",
        featured: false,
        organizer: "Garena",
        location: "Singapore",
        entryFee: 0,
        bracket: null
      }
    ];

    for (const tournament of initialTournaments) {
      await storage.createTournament(tournament);
    }

    // Get tournament IDs for team creation
    const tournaments = await storage.getTournaments();
    console.log(`Found ${tournaments.length} tournaments for team creation`);
    console.log('First tournament:', JSON.stringify(tournaments[0], null, 2));
    
    if (tournaments.length === 0) {
      console.log('⚠️ No tournaments found, skipping team creation');
      return;
    }
    
    // Seed Teams
    console.log('👥 Seeding teams...');
    const sampleTeams = [
      {
        name: "Phoenix Elite",
        logo: "https://example.com/logos/phoenix-elite.png",
        captain: "Alex Frost",
        players: JSON.stringify(["Alex Frost", "Maya Chen", "Ravi Singh", "Diego Vega"]),
        tournamentId: tournaments[0]._id
      },
      {
        name: "Dragon Flames",
        logo: "https://example.com/logos/dragon-flames.png",
        captain: "Sarah Khan",
        players: JSON.stringify(["Sarah Khan", "Li Wei", "Carlos Rodriguez", "Aisha Johnson"]),
        tournamentId: tournaments[0]._id
      },
      {
        name: "Tactical Kings",
        logo: "https://example.com/logos/tactical-kings.png",
        captain: "James Wilson",
        players: JSON.stringify(["James Wilson", "Zara Ahmed", "Kevin Park", "Elena Petrova"]),
        tournamentId: tournaments[1]._id
      },
      {
        name: "Apex Predators",
        logo: "https://example.com/logos/apex-predators.png",
        captain: "Sophia Martinez",
        players: JSON.stringify(["Sophia Martinez", "Raj Patel", "Lucas Kim", "Nina Ivanova"]),
        tournamentId: tournaments[2]._id
      },
      {
        name: "Urban Snipers",
        logo: "https://example.com/logos/urban-snipers.png",
        captain: "Ryan Jackson",
        players: JSON.stringify(["Ryan Jackson", "Emma Chen", "Amir Hassan", "Olivia Brown"]),
        tournamentId: tournaments[1]._id
      },
      {
        name: "Shadow Warriors",
        logo: "https://example.com/logos/shadow-warriors.png",
        captain: "Mei Lin",
        players: JSON.stringify(["Mei Lin", "Jake Torres", "Sam Nguyen", "Leila Abadi"]),
        tournamentId: tournaments[3]._id
      }
    ];

    for (const team of sampleTeams) {
      await storage.createTeam(team);
    }

    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await disconnectDatabase();
  }
}

// Run the seeding script
seedDatabase(); 