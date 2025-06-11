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
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private requests: Map<number, Request>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentRequestId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.requests = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentRequestId = 1;

    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123"
    });

    // Create default categories
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Categories
    await this.createCategory({
      name_ru: "Кровельные материалы",
      name_kz: "Шатыр материалдары",
      description_ru: "Металлочерепица, профнастил, ондулин и другие кровельные покрытия",
      description_kz: "Металл плитка, профнастил, ондулин және басқа шатыр жабындары",
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    });

    await this.createCategory({
      name_ru: "Сайдинг",
      name_kz: "Сайдинг",
      description_ru: "Виниловый, металлический и деревянный сайдинг для отделки фасадов",
      description_kz: "Винил, металл және ағаш сайдинг фасадтарды әшекейлеу үшін",
      image_url: "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    });

    await this.createCategory({
      name_ru: "Водосточные системы",
      name_kz: "Су ағызу жүйелері",
      description_ru: "Желоба, трубы, воронки и комплектующие для водостока",
      description_kz: "Науалар, құбырлар, воронкалар және су ағызу үшін жинақтаушылар",
      image_url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    });

    await this.createCategory({
      name_ru: "Комплектующие",
      name_kz: "Жинақтаушылар",
      description_ru: "Крепежные элементы, инструменты и аксессуары",
      description_kz: "Бекіту элементтері, құралдар және аксессуарлар",
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    });

    // Products
    await this.createProduct({
      name_ru: "Металлочерепица Монтеррей",
      name_kz: "Металл плитка Монтеррей",
      description_ru: "Покрытие полиэстер, толщина 0.5мм",
      description_kz: "Полиэфир жабын, қалыңдығы 0.5мм",
      price: "2850.00",
      unit_ru: "м²",
      unit_kz: "м²",
      category_id: 1,
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      in_stock: true
    });

    await this.createProduct({
      name_ru: "Сайдинг виниловый",
      name_kz: "Винил сайдинг",
      description_ru: "Цвет белый, размер 3.66x0.23м",
      description_kz: "Ақ түс, өлшемі 3.66x0.23м",
      price: "1250.00",
      unit_ru: "панель",
      unit_kz: "панель",
      category_id: 2,
      image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      in_stock: true
    });

    await this.createProduct({
      name_ru: "Желоб водосточный",
      name_kz: "Су ағызатын науа",
      description_ru: "Оцинкованный, диаметр 125мм",
      description_kz: "Мырышталған, диаметрі 125мм",
      price: "890.00",
      unit_ru: "пм",
      unit_kz: "пм",
      category_id: 3,
      image_url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      in_stock: true
    });

    await this.createProduct({
      name_ru: "Саморезы кровельные",
      name_kz: "Шатыр бұрандалары",
      description_ru: "С прокладкой, 4.8x29мм",
      description_kz: "Төсеніш пен, 4.8x29мм",
      price: "12.00",
      unit_ru: "шт",
      unit_kz: "дана",
      category_id: 4,
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      in_stock: true
    });
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

export const storage = new MemStorage();
