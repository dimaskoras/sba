import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { type Category, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Package } from "lucide-react";

export default function Catalog() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [view, setView] = useState<"categories" | "products">("categories");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products based on selected category and search
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory.id;
    const matchesSearch = !searchQuery || 
      product.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_kz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description_ru?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description_kz?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setView("products");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setView("categories");
    setSearchQuery("");
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-in slide-in-from-top-5 duration-500">
          {t("catalog.title")}
        </h1>
        <p className="text-xl text-gray-600 animate-in slide-in-from-top-5 duration-500 delay-150">
          {t("catalog.subtitle")}
        </p>
      </div>

      {view === "categories" ? (
        // Categories View
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 animate-in slide-in-from-left-5 duration-500">
              Выберите категорию
            </h2>
            <p className="text-gray-600 animate-in slide-in-from-left-5 duration-500 delay-100">
              Найдите нужные строительные материалы в удобной категории
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const categoryProducts = allProducts.filter(p => p.category_id === category.id);
              return (
                <Card 
                  key={category.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-in slide-in-from-bottom-5"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-lg mb-4 flex items-center justify-center group-hover:from-brand-primary/20 group-hover:to-brand-primary/10 transition-all duration-300">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={language === "kz" ? category.name_kz : category.name_ru}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-brand-primary/60 group-hover:text-brand-primary/80 transition-colors duration-300" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors duration-300">
                      {language === "kz" ? category.name_kz : category.name_ru}
                    </h3>
                    
                    {(category.description_ru || category.description_kz) && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {language === "kz" ? category.description_kz : category.description_ru}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors duration-300">
                        {categoryProducts.length} товаров
                      </Badge>
                      <div className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Смотреть →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        // Products View
        <div className="space-y-6">
          {/* Header with back button and search */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 animate-in slide-in-from-top-5 duration-500">
            <Button
              variant="outline"
              onClick={handleBackToCategories}
              className="flex items-center gap-2 transition-all duration-300 hover:bg-brand-primary hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к категориям
            </Button>
            
            <div className="flex-1 lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Category info */}
          {selectedCategory && (
            <div className="bg-gradient-to-r from-brand-primary/5 to-brand-primary/10 rounded-lg p-6 animate-in slide-in-from-left-5 duration-500 delay-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === "kz" ? selectedCategory.name_kz : selectedCategory.name_ru}
              </h2>
              {(selectedCategory.description_ru || selectedCategory.description_kz) && (
                <p className="text-gray-700">
                  {language === "kz" ? selectedCategory.description_kz : selectedCategory.description_ru}
                </p>
              )}
              <Badge variant="outline" className="mt-3">
                {filteredProducts.length} товаров найдено
              </Badge>
            </div>
          )}

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in-50 duration-500">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {searchQuery 
                  ? "По вашему запросу ничего не найдено" 
                  : "В этой категории пока нет товаров"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-in slide-in-from-bottom-5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} category={selectedCategory || undefined} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
