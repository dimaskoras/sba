import fs from 'fs/promises';
import path from 'path';
import { User, Category, Product, Request } from '../shared/schema';

interface StorageData {
  users: User[];
  categories: Category[];
  products: Product[];
  requests: Request[];
  counters: {
    userId: number;
    categoryId: number;
    productId: number;
    requestId: number;
  };
}

export class FileStorage {
  private dataPath: string;
  private uploadsPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
    this.uploadsPath = path.join(process.cwd(), 'uploads');
    this.initializeDirectories();
  }

  private async initializeDirectories() {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await fs.mkdir(this.uploadsPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directories:', error);
    }
  }

  private async loadData(): Promise<StorageData> {
    const dataFile = path.join(this.dataPath, 'storage.json');
    
    try {
      const data = await fs.readFile(dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Если файл не существует, создаем начальные данные
      const initialData: StorageData = {
        users: [{
          id: 1,
          username: 'admin',
          password: 'admin123'
        }],
        categories: [
          {
            id: 1,
            name_ru: "Кровельные материалы",
            name_kz: "Шатыр материалдары", 
            description_ru: "Металлочерепица, профнастил, ондулин и другие кровельные покрытия",
            description_kz: "Металл плитка, профнастил, ондулин және басқа шатыр жабындары",
            image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
          },
          {
            id: 2,
            name_ru: "Утеплители",
            name_kz: "Жылу оқшаулағыштар",
            description_ru: "Минеральная вата, пенопласт, пенополистирол для утепления зданий",
            description_kz: "Минералды мақта, көбік, ғимараттарды жылытуға арналған көбікті полистирол",
            image_url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
          }
        ],
        products: [
          {
            id: 1,
            name_ru: "Металлочерепица Монтеррей",
            name_kz: "Монтеррей металл плиткасы",
            description_ru: "Высококачественная металлочерепица с полимерным покрытием. Толщина 0.5мм, гарантия 15 лет.",
            description_kz: "Полимерлі жабынды жоғары сапалы металл плитка. Қалыңдығы 0,5мм, кепілдік 15 жыл.",
            price: "2500",
            unit_ru: "м²",
            unit_kz: "м²",
            category_id: 1,
            image_url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
            in_stock: true
          }
        ],
        requests: [],
        counters: {
          userId: 2,
          categoryId: 3,
          productId: 2,
          requestId: 1
        }
      };
      
      await this.saveData(initialData);
      return initialData;
    }
  }

  private async saveData(data: StorageData): Promise<void> {
    const dataFile = path.join(this.dataPath, 'storage.json');
    try {
      await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    const data = await this.loadData();
    return data.users;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.username === username);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const data = await this.loadData();
    const user: User = {
      ...userData,
      id: data.counters.userId++
    };
    data.users.push(user);
    await this.saveData(data);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    const data = await this.loadData();
    return data.categories;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const categories = await this.getCategories();
    return categories.find(cat => cat.id === id);
  }

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const data = await this.loadData();
    const category: Category = {
      ...categoryData,
      id: data.counters.categoryId++
    };
    data.categories.push(category);
    await this.saveData(data);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<Omit<Category, 'id'>>): Promise<Category | undefined> {
    const data = await this.loadData();
    const categoryIndex = data.categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) return undefined;
    
    data.categories[categoryIndex] = { ...data.categories[categoryIndex], ...updateData };
    await this.saveData(data);
    return data.categories[categoryIndex];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const data = await this.loadData();
    const initialLength = data.categories.length;
    data.categories = data.categories.filter(cat => cat.id !== id);
    
    if (data.categories.length < initialLength) {
      await this.saveData(data);
      return true;
    }
    return false;
  }

  async getProducts(): Promise<Product[]> {
    const data = await this.loadData();
    return data.products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.category_id === categoryId);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name_ru.toLowerCase().includes(lowercaseQuery) ||
      product.name_kz.toLowerCase().includes(lowercaseQuery) ||
      (product.description_ru && product.description_ru.toLowerCase().includes(lowercaseQuery)) ||
      (product.description_kz && product.description_kz.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const data = await this.loadData();
    const product: Product = {
      ...productData,
      id: data.counters.productId++
    };
    data.products.push(product);
    await this.saveData(data);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<Omit<Product, 'id'>>): Promise<Product | undefined> {
    const data = await this.loadData();
    const productIndex = data.products.findIndex(product => product.id === id);
    if (productIndex === -1) return undefined;
    
    data.products[productIndex] = { ...data.products[productIndex], ...updateData };
    await this.saveData(data);
    return data.products[productIndex];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const data = await this.loadData();
    const initialLength = data.products.length;
    data.products = data.products.filter(product => product.id !== id);
    
    if (data.products.length < initialLength) {
      await this.saveData(data);
      return true;
    }
    return false;
  }

  async getRequests(): Promise<Request[]> {
    const data = await this.loadData();
    return data.requests;
  }

  async createRequest(requestData: Omit<Request, 'id' | 'created_at'>): Promise<Request> {
    const data = await this.loadData();
    const request: Request = {
      ...requestData,
      id: data.counters.requestId++,
      created_at: new Date().toISOString()
    };
    data.requests.push(request);
    await this.saveData(data);
    return request;
  }

  getUploadsPath(): string {
    return this.uploadsPath;
  }
}