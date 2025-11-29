import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import type { User, InsertUser } from "@shared/schema";

const __dirname = join(fileURLToPath(import.meta.url), "..", "..");
const dataDir = join(__dirname, "server", "data");

// Ensure data directory exists
mkdirSync(dataDir, { recursive: true });

const usersFile = join(dataDir, "users.json");

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class FileStorage implements IStorage {
  private users: User[] = [];
  private currentId: number = 1;

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      if (require("fs").existsSync(usersFile)) {
        const data = readFileSync(usersFile, "utf-8");
        this.users = JSON.parse(data);
        this.currentId = Math.max(...this.users.map(u => u.id), 0) + 1;
      }
    } catch (error) {
      this.users = [];
      this.currentId = 1;
    }
  }

  private saveUsers() {
    writeFileSync(usersFile, JSON.stringify(this.users, null, 2));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.currentId++ };
    this.users.push(user);
    this.saveUsers();
    return user;
  }
}

export const storage = new FileStorage();
