import { users, categories, products, requests, type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Request, type InsertRequest } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Requests
  createRequest(request: InsertRequest): Promise<Request>;
  getAllRequests(): Promise<Request[]>;
}

import { FileStorage } from './fileStorage';

export class MemStorage implements IStorage {
  private fileStorage: FileStorage;

  constructor() {
    this.fileStorage = new FileStorage();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description_ru: insertCategory.description_ru || null,
      description_kz: insertCategory.description_kz || null,
      image_url: insertCategory.image_url || null
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updated = { ...category, ...updateData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category_id === categoryId
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name_ru.toLowerCase().includes(lowercaseQuery) ||
      product.name_kz.toLowerCase().includes(lowercaseQuery) ||
      (product.description_ru && product.description_ru.toLowerCase().includes(lowercaseQuery)) ||
      (product.description_kz && product.description_kz.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      description_ru: insertProduct.description_ru || null,
      description_kz: insertProduct.description_kz || null,
      image_url: insertProduct.image_url || null,
      category_id: insertProduct.category_id || null,
      in_stock: insertProduct.in_stock ?? true
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...updateData };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Requests
  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const id = this.currentRequestId++;
    const request: Request = { 
      ...insertRequest, 
      id, 
      comment: insertRequest.comment || null,
      created_at: new Date().toISOString() 
    };
    this.requests.set(id, request);
    return request;
  }

  async getAllRequests(): Promise<Request[]> {
    return Array.from(this.requests.values());
  }
}

import { FileBasedStorage } from './fileBasedStorage';

export const storage = new FileBasedStorage();
