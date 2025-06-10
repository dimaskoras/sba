import { useState } from "react";
import { useQuery, useMutation, queryClient } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Category, insertCategorySchema } from "@shared/schema";
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
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";

interface CategoryFormData {
  name_ru: string;
  name_kz: string;
  description_ru: string;
  description_kz: string;
  image_url: string;
}

export default function Categories() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name_ru: "",
    name_kz: "",
    description_ru: "",
    description_kz: "",
    image_url: "",
  });

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => apiRequest("POST", "/api/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: t("common.success"),
        description: "Категория успешно создана",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось создать категорию",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryFormData> }) =>
      apiRequest("PUT", `/api/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: t("common.success"),
        description: "Категория успешно обновлена",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось обновить категорию",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: t("common.success"),
        description: "Категория успешно удалена",
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось удалить категорию",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = insertCategorySchema.parse(formData);

      if (editingCategory) {
        updateMutation.mutate({ id: editingCategory.id, data: validatedData });
      } else {
        createMutation.mutate(validatedData);
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_ru: category.name_ru,
      name_kz: category.name_kz,
      description_ru: category.description_ru || "",
      description_kz: category.description_kz || "",
      image_url: category.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name_ru: "",
      name_kz: "",
      description_ru: "",
      description_kz: "",
      image_url: "",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("admin.categories")}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Редактировать категорию" : "Добавить категорию"}
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

              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image_url: e.target.value }))
                  }
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCategory ? "Обновить" : "Создать"}
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
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={language === "kz" ? category.name_kz : category.name_ru}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              <h3 className="font-semibold text-lg mb-2">
                {language === "kz" ? category.name_kz : category.name_ru}
              </h3>
              {category.description_ru && (
                <p className="text-gray-600 text-sm mb-4">
                  {language === "kz"
                    ? category.description_kz
                    : category.description_ru}
                </p>
              )}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Изменить
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Категории не найдены</p>
        </div>
      )}
    </div>
  );
}
