import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n";
import { type Product, type Category, type Request } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Tag, MessageSquare, Users, Plus } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: requests = [] } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
  });

  const stats = [
    {
      title: t("admin.products"),
      value: products.length,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: t("admin.categories"),
      value: categories.length,
      icon: Tag,
      href: "/admin/categories",
      color: "bg-green-500",
    },
    {
      title: t("admin.requests"),
      value: requests.length,
      icon: MessageSquare,
      href: "/admin/requests",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.dashboard")}
          </h1>
          <p className="text-gray-600">Добро пожаловать, {user?.username}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`${stat.color} text-white rounded-full w-12 h-12 flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/products">
              <Button className="w-full justify-start bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button
                variant="outline"
                className="w-full justify-start border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние заявки</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-gray-600">Заявок пока нет</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-600">{request.phone}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                ))}
                {requests.length > 5 && (
                  <Link href="/admin/requests">
                    <Button variant="link" className="w-full">
                      Смотреть все заявки
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
