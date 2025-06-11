import { FileStorage } from './fileStorage';
import { IStorage } from './storage';
import { User, Category, Product, Request, InsertUser, InsertCategory, InsertProduct, InsertRequest } from '../shared/schema';

export class FileBasedStorage implements IStorage {
  private fileStorage: FileStorage;

  constructor() {
    this.fileStorage = new FileStorage();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.fileStorage.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.fileStorage.getUserByUsername(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return this.fileStorage.createUser(insertUser);
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return this.fileStorage.getCategories();
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.fileStorage.getCategoryById(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    return this.fileStorage.createCategory({
      ...insertCategory,
      description_ru: insertCategory.description_ru || null,
      description_kz: insertCategory.description_kz || null,
      image_url: insertCategory.image_url || null
    });
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    return this.fileStorage.updateCategory(id, updateData);
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.fileStorage.deleteCategory(id);
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return this.fileStorage.getProducts();
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.fileStorage.getProductById(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return this.fileStorage.getProductsByCategory(categoryId);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.fileStorage.searchProducts(query);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    return this.fileStorage.createProduct({
      ...insertProduct,
      description_ru: insertProduct.description_ru || null,
      description_kz: insertProduct.description_kz || null,
      image_url: insertProduct.image_url || null,
      category_id: insertProduct.category_id || null,
      in_stock: insertProduct.in_stock ?? null
    });
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    return this.fileStorage.updateProduct(id, updateData);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.fileStorage.deleteProduct(id);
  }

  // Requests
  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    return this.fileStorage.createRequest({
      ...insertRequest,
      comment: insertRequest.comment || null
    });
  }

  async getAllRequests(): Promise<Request[]> {
    return this.fileStorage.getRequests();
  }
}