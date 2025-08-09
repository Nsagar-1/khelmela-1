import {
  type User, type InsertUser,
  type Tournament, type InsertTournament,
  type Stat, type InsertStat,
  type Team, type InsertTeam,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { IStorage } from "../storage";
import { User as UserModel } from "../models/User";
import { Tournament as TournamentModel } from "../models/Tournament";
import { Stat as StatModel } from "../models/Stat";
import { Team as TeamModel } from "../models/Team";
import { ContactMessage as ContactMessageModel } from "../models/ContactMessage";

export class MongoDBStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id).lean();
      return user ? user as User : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email }).lean();
      return user ? user as User : undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }
  

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username }).lean();
      return user ? user as User : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Ensure admin field defaults to false if not provided
      const userData = {
        ...insertUser,
        admin: insertUser.admin ?? 'user'
      };
      const user = new UserModel(userData);
      const savedUser = await user.save();
      return savedUser.toJSON() as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        userUpdate,
        { new: true }
      ).lean();
      return user ? user as User : undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Tournament methods
  async getTournaments(): Promise<Tournament[]> {
    try {
      const tournaments = await TournamentModel.find().lean();
      return tournaments as Tournament[];
    } catch (error) {
      console.error('Error getting tournaments:', error);
      return [];
    }
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    try {
      const tournament = await TournamentModel.findById(id).lean();
      return tournament ? tournament as Tournament : undefined;
    } catch (error) {
      console.error('Error getting tournament:', error);
      return undefined;
    }
  }

  async getFeaturedTournaments(): Promise<Tournament[]> {
    try {
      const tournaments = await TournamentModel.find({ featured: true }).lean();
      return tournaments as Tournament[];
    } catch (error) {
      console.error('Error getting featured tournaments:', error);
      return [];
    }
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    try {
      const tournament = new TournamentModel(insertTournament);
      const savedTournament = await tournament.save();
      return savedTournament.toJSON() as Tournament;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  }

  async updateTournament(id: number, tournamentUpdate: Partial<Tournament>): Promise<Tournament | undefined> {
    try {
      const tournament = await TournamentModel.findByIdAndUpdate(
        id,
        tournamentUpdate,
        { new: true }
      ).lean();
      return tournament ? tournament as Tournament : undefined;
    } catch (error) {
      console.error('Error updating tournament:', error);
      return undefined;
    }
  }

  async deleteTournament(id: number): Promise<boolean> {
    try {
      const result = await TournamentModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting tournament:', error);
      return false;
    }
  }

  // Stats methods
  async getStats(): Promise<Stat[]> {
    try {
      const stats = await StatModel.find().sort({ order: 1 }).lean();
      return stats as Stat[];
    } catch (error) {
      console.error('Error getting stats:', error);
      return [];
    }
  }

  async getStat(id: number): Promise<Stat | undefined> {
    try {
      const stat = await StatModel.findById(id).lean();
      return stat ? stat as Stat : undefined;
    } catch (error) {
      console.error('Error getting stat:', error);
      return undefined;
    }
  }

  async createStat(insertStat: InsertStat): Promise<Stat> {
    try {
      const stat = new StatModel(insertStat);
      const savedStat = await stat.save();
      return savedStat.toJSON() as Stat;
    } catch (error) {
      console.error('Error creating stat:', error);
      throw error;
    }
  }

  async updateStat(id: number, statUpdate: Partial<Stat>): Promise<Stat | undefined> {
    try {
      const stat = await StatModel.findByIdAndUpdate(
        id,
        statUpdate,
        { new: true }
      ).lean();
      return stat ? stat as Stat : undefined;
    } catch (error) {
      console.error('Error updating stat:', error);
      return undefined;
    }
  }

  async deleteStat(id: number): Promise<boolean> {
    try {
      const result = await StatModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting stat:', error);
      return false;
    }
  }

  // Team methods
  async getTeams(tournamentId?: number): Promise<Team[]> {
    try {
      const query = tournamentId ? { tournamentId } : {};
      const teams = await TeamModel.find(query).lean();
      return teams as Team[];
    } catch (error) {
      console.error('Error getting teams:', error);
      return [];
    }
  }

  async getTeam(id: number): Promise<Team | undefined> {
    try {
      const team = await TeamModel.findById(id).lean();
      return team ? team as Team : undefined;
    } catch (error) {
      console.error('Error getting team:', error);
      return undefined;
    }
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    try {
      const team = new TeamModel(insertTeam);
      const savedTeam = await team.save();
      return savedTeam.toJSON() as Team;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async updateTeam(id: number, teamUpdate: Partial<Team>): Promise<Team | undefined> {
    try {
      const team = await TeamModel.findByIdAndUpdate(
        id,
        teamUpdate,
        { new: true }
      ).lean();
      return team ? team as Team : undefined;
    } catch (error) {
      console.error('Error updating team:', error);
      return undefined;
    }
  }

  async deleteTeam(id: number): Promise<boolean> {
    try {
      const result = await TeamModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }

  // Contact methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      const message = new ContactMessageModel(insertMessage);
      const savedMessage = await message.save();
      return savedMessage.toJSON() as ContactMessage;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const messages = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
      return messages as ContactMessage[];
    } catch (error) {
      console.error('Error getting contact messages:', error);
      return [];
    }
  }
} 