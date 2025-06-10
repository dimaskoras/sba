import { Product, Category } from "@shared/schema";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={name}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{name}</h4>
        {description && (
          <p className="text-gray-600 text-sm mb-3">{description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-brand-primary">
            {product.price} ₸/{unit}
          </span>
          <Button
            size="sm"
            className="bg-brand-secondary hover:bg-brand-secondary/90 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            В корзину
          </Button>
        </div>
        {!product.in_stock && (
          <div className="mt-2 text-sm text-red-600 font-medium">
            Нет в наличии
          </div>
        )}
      </CardContent>
    </Card>
  );
}
