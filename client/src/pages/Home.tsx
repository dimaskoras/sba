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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-primary to-blue-900 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-slide-down">
              {t("hero.title")}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-brand-secondary hover:bg-brand-secondary/90 text-white px-8 py-4 text-lg h-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {t("hero.cta_request")}
              </Button>
              <Link href="/catalog">
                <Button
                  variant="outline"
                  className="bg-white text-brand-primary border-white hover:bg-gray-100 px-8 py-4 text-lg h-auto w-full sm:w-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
          <div className="text-center mb-12 animate-slide-up">
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
                className="text-center p-6 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-brand-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:scale-110">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-300 hover:text-brand-primary">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("catalog.title")}
            </h2>
            <p className="text-xl text-gray-600">{t("catalog.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {categories.map((category, index) => (
              <Link key={category.id} href="/catalog">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="relative overflow-hidden">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={
                          language === "kz" ? category.name_kz : category.name_ru
                        }
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
                        <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-brand-primary text-2xl font-bold">
                            {(language === "kz" ? category.name_kz : category.name_ru).charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-brand-primary">
                      {language === "kz" ? category.name_kz : category.name_ru}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
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
                      <span className="text-brand-primary font-medium transition-transform duration-300 group-hover:translate-x-1">
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
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Популярные товары
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${800 + index * 150}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center animate-bounce-in" style={{ animationDelay: '1.2s' }}>
            <Link href="/catalog">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
