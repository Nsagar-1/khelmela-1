import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import { User } from "./models/User";
import jwt from "jsonwebtoken";
import { Blog } from './models/Blog';
import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path resolution - go up one level from config to server
const envPath = path.join(__dirname, '.env');

const envConfig = dotenv.config({ 
  path: envPath,
  debug: true 
});
if (envConfig.error) {
  console.error('❌ Error loading .env file:', envConfig.error);
  process.exit(1);
}

const Jwt = process.env.JWT_SECRET || '';

export async function registerRoutes(app: Express): Promise<Server> {

  
  // Get all tournaments
  app.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      
      // Format dates for display
      const formattedTournaments = tournaments.map(tournament => ({
        ...tournament,
        date: formatDateRange(tournament.startDate, tournament.endDate)
      }));
      
      res.json(formattedTournaments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving tournaments" });
    }
  });

  // Get featured tournaments
  app.get("/api/tournaments/featured", async (req, res) => {
    try {
      const tournaments = await storage.getFeaturedTournaments();
      
      // Format dates for display
      const formattedTournaments = tournaments.map(tournament => ({
        ...tournament,
        date: formatDateRange(tournament.startDate, tournament.endDate)
      }));
      
      res.json(formattedTournaments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving featured tournaments" });
    }
  });

  // Get a specific tournament by ID
  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      // Get teams for this tournament
      const teams = await storage.getTeams(id);
      
      // Format dates for display
      const formattedTournament = {
        ...tournament,
        date: formatDateRange(tournament.startDate, tournament.endDate),
        teams
      };
      
      res.json(formattedTournament);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving tournament" });
    }
  });

  // Get all stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving stats" });
    }
  });

  // Get teams for a tournament
  app.get("/api/tournaments/:id/teams", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const teams = await storage.getTeams(id);
      res.json(teams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving teams" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Create contact message
      const message = await storage.createContactMessage(validatedData);
      
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error(error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, profilePhoto, admin } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        profilePhoto: profilePhoto || '', // Optional field
        admin
      });
      
      const { password: _, ...userWithoutPassword } = newUser;` `
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: "Error creating user" });
    }
  });
  
  app.post("/api/login", async (req, res) => {
    const user = await User.findOne({email: req.body.email}).lean()
    if(user){
      try{
      const {email,password} = user;
      const isMatched= await bcrypt.compareSync(req.body.password, password)
      if(email && isMatched){
        const token = jwt.sign({ email: req.body.email }, Jwt, { expiresIn: '1h' });
        const { password, ...userData } = user;
      const responseData = {
        ...userData,
        token // Add token to the new object
      };
      res.status(200).json(responseData);
         res.status(200).json({
          msg:"logged in successfully",
          isLogedin:true,
          userData: responseData
        })
      }
      else{
        res.status(401).json({
          errorMsg:"Invalid email or password"
        })
      }
      }
      catch(err){
        console.log(err)
      }
      }
      else{
        res.status(401).json({
          errorMsg:"User doesn't exist"
        })
      }
  
  });
  
  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: "Error retrieving user" });
    }
  });

  // Update user admin status
  app.patch("/api/users/:id/admin", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const { admin } = req.body;

      const updatedUser = await storage.updateUser(id, { admin });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ 
        success: true,
        message: "User admin status updated successfully",
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: "Error updating user" });
    }
  });

  // Create Blog
  app.post('/api/blogs', async (req: Request, res: Response) => {
    try {
      const { category, user_name, user_id, title, description, image } = req.body;
      const blog = new Blog({
        user_id,
        title,
        description,
        image, 
        user_name,
        category
      });
      await blog.save();
      res.status(201).json(blog);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating blog', error });
    }
  });
  

  // Update Blog
  app.put('/api/blogs/:id', async (req: Request, res: Response) => {
    try {
      const { title, description, image, category } = req.body;
      const updateData: any = { title, description, image, category  };
      const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json(blog);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating blog', error });
    }
  });

  // Delete Blog
  app.delete('/api/blogs/:id', async (req: Request, res: Response) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json({ message: 'Blog deleted' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting blog', error });
    }
  });

  // GET /api/blogs with pagination
  app.get('/api/blogs', async (req: Request, res: Response) => {
  try {
    // Validate and parse query parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // Add filtering options if needed
    const filter: any = {};
    if (req.query.gameCategory) {
      filter.gameCategory = req.query.gameCategory;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'username profilePhoto'),
      Blog.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching blogs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  });

  // Add this to your backend routes
  app.get('/api/blogs/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id).lean()
      // .populate('user_id', 'username profilePhoto') // Populate user data
      // .lean();
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const responseData = {
      ...blog,
      createdAt: blog.createdAt.toISOString()
    };

    res.json(responseData);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to format date range for display
function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);
  
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  // Add year only if different from current year or if start and end have different years
  if (startYear !== endYear) {
    return `${start}, ${startYear} - ${end}, ${endYear}`;
  }
  
  // Add year only if different from current year
  const currentYear = new Date().getFullYear();
  if (startYear !== currentYear) {
    return `${start} - ${end}, ${startYear}`;
  }
  
  return `${start} - ${end}`;
}
