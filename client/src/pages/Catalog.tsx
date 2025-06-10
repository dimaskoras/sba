import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { type Category, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Catalog() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: selectedCategory, search: searchQuery }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      
      return fetch(`/api/products?${params.toString()}`, {
        credentials: "include",
      }).then(res => res.json());
    },
  });

  const handleSearch = () => {
    // Query will automatically refetch due to dependency on searchQuery
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-lg">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {t("catalog.title")}
        </h1>
        <p className="text-xl text-gray-600">{t("catalog.subtitle")}</p>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={t("catalog.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder={t("common.all_categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all_categories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {language === "kz" ? category.name_kz : category.name_ru}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSearch}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            {t("catalog.find")}
          </Button>
        </div>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchQuery || selectedCategory
              ? "По вашему запросу ничего не найдено"
              : "Товары не найдены"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
