import { Product, Category } from "@shared/schema";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
  category?: Category;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useTranslation();

  const name = language === "kz" ? product.name_kz : product.name_ru;
  const description = language === "kz" ? product.description_kz : product.description_ru;
  const unit = language === "kz" ? product.unit_kz : product.unit_ru;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      <div className="relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {!product.in_stock && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs">
              Нет в наличии
            </Badge>
          </div>
        )}
        
        {product.in_stock && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              В наличии
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-brand-primary transition-colors duration-300 line-clamp-2">
            {name}
          </h4>
          {description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-brand-primary">
              {product.price} ₸
            </span>
            <span className="text-sm text-gray-500">за {unit}</span>
          </div>
          
          <Button
            size="sm"
            disabled={!product.in_stock}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white transition-all duration-300 transform group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {product.in_stock ? "В корзину" : "Недоступно"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
