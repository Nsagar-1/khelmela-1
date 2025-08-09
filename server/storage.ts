import {
  type User, type InsertUser, users,
  type Tournament, type InsertTournament, tournaments,
  type Stat, type InsertStat, stats,
  type Team, type InsertTeam, teams,
  type ContactMessage, type InsertContactMessage, contactMessages
} from "@shared/schema";
import { format } from "date-fns";
import { MongoDBStorage } from './storage/mongodb';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined>;

  // Tournament methods
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  getFeaturedTournaments(): Promise<Tournament[]>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: number, tournament: Partial<Tournament>): Promise<Tournament | undefined>;
  deleteTournament(id: number): Promise<boolean>;

  // Stats methods
  getStats(): Promise<Stat[]>;
  getStat(id: number): Promise<Stat | undefined>;
  createStat(stat: InsertStat): Promise<Stat>;
  updateStat(id: number, stat: Partial<Stat>): Promise<Stat | undefined>;
  deleteStat(id: number): Promise<boolean>;

  // Team methods
  getTeams(tournamentId?: number): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;

  // Contact methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tournaments: Map<number, Tournament>;
  private stats: Map<number, Stat>;
  private teams: Map<number, Team>;
  private contactMessages: Map<number, ContactMessage>;
  private currentIds: {
    users: number;
    tournaments: number;
    stats: number;
    teams: number;
    contactMessages: number;
  };

  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
    this.stats = new Map();
    this.teams = new Map();
    this.contactMessages = new Map();
    this.currentIds = {
      users: 1,
      tournaments: 1,
      stats: 1,
      teams: 1,
      contactMessages: 1
    };

    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id,
      admin: insertUser.admin || "user",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userUpdate, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Tournament methods
  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async getFeaturedTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(tournament => tournament.featured);
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const id = this.currentIds.tournaments++;
    const tournament: Tournament = { 
      id,
      createdAt: new Date(),
      name: insertTournament.name,
      description: insertTournament.description,
      game: insertTournament.game,
      category: insertTournament.category,
      image: insertTournament.image,
      status: insertTournament.status,
      prizePool: insertTournament.prizePool,
      teamSize: insertTournament.teamSize,
      maxTeams: insertTournament.maxTeams,
      registeredTeams: insertTournament.registeredTeams,
      startDate: insertTournament.startDate,
      endDate: insertTournament.endDate,
      organizer: insertTournament.organizer,
      rules: insertTournament.rules || null,
      featured: insertTournament.featured ?? null,
      location: insertTournament.location || null,
      bracket: insertTournament.bracket || null,
      entryFee: insertTournament.entryFee ?? null
    };
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async updateTournament(id: number, tournamentUpdate: Partial<Tournament>): Promise<Tournament | undefined> {
    const tournament = this.tournaments.get(id);
    if (!tournament) return undefined;

    const updatedTournament = { ...tournament, ...tournamentUpdate };
    this.tournaments.set(id, updatedTournament);
    return updatedTournament;
  }

  async deleteTournament(id: number): Promise<boolean> {
    return this.tournaments.delete(id);
  }

  // Stats methods
  async getStats(): Promise<Stat[]> {
    return Array.from(this.stats.values()).sort((a, b) => a.order - b.order);
  }

  async getStat(id: number): Promise<Stat | undefined> {
    return this.stats.get(id);
  }

  async createStat(insertStat: InsertStat): Promise<Stat> {
    const id = this.currentIds.stats++;
    const stat: Stat = { ...insertStat, id };
    this.stats.set(id, stat);
    return stat;
  }

  async updateStat(id: number, statUpdate: Partial<Stat>): Promise<Stat | undefined> {
    const stat = this.stats.get(id);
    if (!stat) return undefined;

    const updatedStat = { ...stat, ...statUpdate };
    this.stats.set(id, updatedStat);
    return updatedStat;
  }

  async deleteStat(id: number): Promise<boolean> {
    return this.stats.delete(id);
  }

  // Team methods
  async getTeams(tournamentId?: number): Promise<Team[]> {
    const teams = Array.from(this.teams.values());
    if (tournamentId) {
      return teams.filter(team => team.tournamentId === tournamentId);
    }
    return teams;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.currentIds.teams++;
    const team: Team = { 
      ...insertTeam, 
      id,
      createdAt: new Date(),
      logo: insertTeam.logo || null 
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: number, teamUpdate: Partial<Team>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;

    const updatedTeam = { ...team, ...teamUpdate };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Contact methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentIds.contactMessages++;
    const message: ContactMessage = { ...insertMessage, id, createdAt: new Date() };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  // Initialize with sample data
  private initializeData() {
    // Stats
    const initialStats: InsertStat[] = [
      { label: "Active Players", value: "10K+", order: 1 },
      { label: "Tournaments", value: "500+", order: 2 },
      { label: "Prize Money", value: "$1M+", order: 3 },
      { label: "Game Titles", value: "20+", order: 4 },
    ];

    initialStats.forEach(stat => {
      this.createStat(stat);
    });

    // Tournaments
    const initialTournaments: InsertTournament[] = [
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

    initialTournaments.forEach(tournament => {
      this.createTournament(tournament);
    });

    // Teams (sample data for each tournament)
    const sampleTeams: InsertTeam[] = [
      {
        name: "Phoenix Elite",
        logo: "https://example.com/logos/phoenix-elite.png",
        captain: "Alex Frost",
        players: JSON.stringify(["Alex Frost", "Maya Chen", "Ravi Singh", "Diego Vega"]),
        tournamentId: 1
      },
      {
        name: "Dragon Flames",
        logo: "https://example.com/logos/dragon-flames.png",
        captain: "Sarah Khan",
        players: JSON.stringify(["Sarah Khan", "Li Wei", "Carlos Rodriguez", "Aisha Johnson"]),
        tournamentId: 1
      },
      {
        name: "Tactical Kings",
        logo: "https://example.com/logos/tactical-kings.png",
        captain: "James Wilson",
        players: JSON.stringify(["James Wilson", "Zara Ahmed", "Kevin Park", "Elena Petrova"]),
        tournamentId: 2
      },
      {
        name: "Apex Predators",
        logo: "https://example.com/logos/apex-predators.png",
        captain: "Sophia Martinez",
        players: JSON.stringify(["Sophia Martinez", "Raj Patel", "Lucas Kim", "Nina Ivanova"]),
        tournamentId: 3
      },
      {
        name: "Urban Snipers",
        logo: "https://example.com/logos/urban-snipers.png",
        captain: "Ryan Jackson",
        players: JSON.stringify(["Ryan Jackson", "Emma Chen", "Amir Hassan", "Olivia Brown"]),
        tournamentId: 2
      },
      {
        name: "Shadow Warriors",
        logo: "https://example.com/logos/shadow-warriors.png",
        captain: "Mei Lin",
        players: JSON.stringify(["Mei Lin", "Jake Torres", "Sam Nguyen", "Leila Abadi"]),
        tournamentId: 4
      }
    ];

    sampleTeams.forEach(team => {
      this.createTeam(team);
    });
  }
}

// Choose between MongoDB and in-memory storage
// For production, use MongoDB
// For development/testing, you can use MemStorage

export const storage = new MongoDBStorage();

// Uncomment the line below to use in-memory storage instead
// export const storage = new MemStorage();
