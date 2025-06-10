import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Product, type Category, insertProductSchema } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

interface ProductFormData {
  name_ru: string;
  name_kz: string;
  description_ru: string;
  description_kz: string;
  price: string;
  unit_ru: string;
  unit_kz: string;
  category_id: number | null;
  image_url: string;
  in_stock: boolean;
}

export default function Products() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name_ru: "",
    name_kz: "",
    description_ru: "",
    description_kz: "",
    price: "",
    unit_ru: "",
    unit_kz: "",
    category_id: null,
    image_url: "",
    in_stock: true,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("common.success"),
        description: "Товар успешно создан",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось создать товар",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("common.success"),
        description: "Товар успешно обновлен",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось обновить товар",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: t("common.success"),
        description: "Товар успешно удален",
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = insertProductSchema.parse({
        ...formData,
        category_id: formData.category_id || undefined,
      });

      const cleanData: ProductFormData = {
        name_ru: validatedData.name_ru,
        name_kz: validatedData.name_kz,
        description_ru: validatedData.description_ru || "",
        description_kz: validatedData.description_kz || "",
        price: validatedData.price,
        unit_ru: validatedData.unit_ru,
        unit_kz: validatedData.unit_kz,
        category_id: validatedData.category_id || null,
        image_url: validatedData.image_url || "",
        in_stock: validatedData.in_stock ?? true,
      };

      if (editingProduct) {
        updateMutation.mutate({ id: editingProduct.id, data: cleanData });
      } else {
        createMutation.mutate(cleanData);
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const editData = {
      name_ru: product.name_ru,
      name_kz: product.name_kz,
      description_ru: product.description_ru || "",
      description_kz: product.description_kz || "",
      price: product.price,
      unit_ru: product.unit_ru,
      unit_kz: product.unit_kz,
      category_id: product.category_id,
      image_url: product.image_url || "",
      in_stock: product.in_stock ?? true,
    };
    setFormData(editData);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name_ru: "",
      name_kz: "",
      description_ru: "",
      description_kz: "",
      price: "",
      unit_ru: "",
      unit_kz: "",
      category_id: null,
      image_url: "",
      in_stock: true,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      deleteMutation.mutate(id);
    }
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("admin.products")}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Редактировать товар" : "Добавить товар"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ru">Название (рус) *</Label>
                  <Input
                    id="name_ru"
                    required
                    value={formData.name_ru}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name_ru: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="name_kz">Название (каз) *</Label>
                  <Input
                    id="name_kz"
                    required
                    value={formData.name_kz}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name_kz: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_ru">Описание (рус)</Label>
                  <Textarea
                    id="description_ru"
                    value={formData.description_ru}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description_ru: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description_kz">Описание (каз)</Label>
                  <Textarea
                    id="description_kz"
                    value={formData.description_kz}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description_kz: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Цена *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="unit_ru">Единица (рус) *</Label>
                  <Input
                    id="unit_ru"
                    required
                    placeholder="м², шт, пм"
                    value={formData.unit_ru}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, unit_ru: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="unit_kz">Единица (каз) *</Label>
                  <Input
                    id="unit_kz"
                    required
                    placeholder="м², дана, пм"
                    value={formData.unit_kz}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, unit_kz: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: value ? parseInt(value) : null,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {language === "kz" ? category.name_kz : category.name_ru}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ImageUploader
                label="Изображение товара"
                currentImage={formData.image_url}
                onImageUpload={(imageUrl) =>
                  setFormData((prev) => ({ ...prev, image_url: imageUrl }))
                }
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="in_stock"
                  checked={formData.in_stock}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, in_stock: checked }))
                  }
                />
                <Label htmlFor="in_stock">В наличии</Label>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingProduct ? "Обновить" : "Создать"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const category = categories.find((c) => c.id === product.category_id);
          return (
            <Card key={product.id}>
              <CardContent className="p-4">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={language === "kz" ? product.name_kz : product.name_ru}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">
                  {language === "kz" ? product.name_kz : product.name_ru}
                </h3>
                {product.description_ru && (
                  <p className="text-gray-600 text-sm mb-2">
                    {language === "kz"
                      ? product.description_kz
                      : product.description_ru}
                  </p>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-brand-primary">
                    {product.price} ₸/
                    {language === "kz" ? product.unit_kz : product.unit_ru}
                  </span>
                  <Badge variant={product.in_stock ? "default" : "destructive"}>
                    {product.in_stock ? "В наличии" : "Нет в наличии"}
                  </Badge>
                </div>
                {category && (
                  <p className="text-sm text-gray-500 mb-4">
                    Категория:{" "}
                    {language === "kz" ? category.name_kz : category.name_ru}
                  </p>
                )}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Товары не найдены</p>
        </div>
      )}
    </div>
  );
}
