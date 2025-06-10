import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { RequestModal } from "@/components/RequestModal";
import { ProductCard } from "@/components/ProductCard";
import { type Category, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Truck, Users, Calculator, Send, Eye } from "lucide-react";

export default function Home() {
  const { t, language } = useTranslation();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.slice(0, 4);

  const features = [
    {
      icon: Shield,
      title: t("features.quality"),
      description:
        "Все материалы сертифицированы и имеют официальную гарантию производителя",
    },
    {
      icon: Truck,
      title: t("features.delivery"),
      description: "Доставляем заказы по Астане и области в кратчайшие сроки",
    },
    {
      icon: Users,
      title: t("features.consultants"),
      description:
        "Наши специалисты помогут подобрать оптимальное решение для вашего проекта",
    },
    {
      icon: Calculator,
      title: t("features.prices"),
      description:
        "Работаем напрямую с производителями, предлагаем конкурентные цены",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-primary to-blue-900 text-white py-20">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-100">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-brand-secondary hover:bg-brand-secondary/90 text-white px-8 py-4 text-lg h-auto"
              >
                <Send className="w-5 h-5 mr-2" />
                {t("hero.cta_request")}
              </Button>
              <Link href="/catalog">
                <Button
                  variant="outline"
                  className="bg-white text-brand-primary border-white hover:bg-gray-100 px-8 py-4 text-lg h-auto w-full sm:w-auto"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {t("hero.cta_catalog")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("features.title")}
            </h2>
            <p className="text-xl text-gray-600">
              Преимущества работы с SmartBuildAstana
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="bg-brand-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("catalog.title")}
            </h2>
            <p className="text-xl text-gray-600">{t("catalog.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => (
              <Link key={category.id} href="/catalog">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={
                        language === "kz" ? category.name_kz : category.name_ru
                      }
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {language === "kz" ? category.name_kz : category.name_ru}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === "kz"
                        ? category.description_kz
                        : category.description_ru}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {
                          products.filter((p) => p.category_id === category.id)
                            .length
                        }{" "}
                        товаров
                      </span>
                      <span className="text-brand-primary font-medium">
                        Подробнее →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Популярные товары
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/catalog">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 text-lg">
                <Eye className="w-5 h-5 mr-2" />
                {t("catalog.view_all")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
