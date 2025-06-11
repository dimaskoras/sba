import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RequestModal } from "./RequestModal";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Phone, MessageSquare, User } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { href: "/", label: t("nav.home") },
    { href: "/catalog", label: t("nav.catalog") },
    { href: "/about", label: t("nav.about") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top contact bar */}
      <div className="bg-brand-primary text-white py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>{t("working_hours")}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="tel:+77016634352"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              +7 701 663 43 52
            </a>
            <a
              href="https://t.me/+77016634352"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaTelegram className="w-4 h-4 mr-2" />
              Telegram
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=77016634352"
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="SmartBuildAstana Logo"
                className="w-12 h-12 rounded-lg mr-3 object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="bg-brand-primary text-white rounded-lg p-3 mr-3 hidden">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartBuildAstana</h1>
                <p className="text-sm text-gray-600">{t("tagline")}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    location === item.href
                      ? "text-brand-primary"
                      : "text-gray-700 hover:text-brand-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Language switcher and mobile menu */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />

              {/* Mobile menu button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`font-medium transition-colors ${
                          location === item.href
                            ? "text-brand-primary"
                            : "text-gray-700 hover:text-brand-primary"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Company info */}
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="SmartBuildAstana Logo"
                  className="w-10 h-10 rounded-lg mr-3 object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="bg-brand-primary text-white rounded-lg p-2 mr-3 hidden">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SmartBuildAstana</h3>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{t("tagline")}</p>
              <div className="flex space-x-4">
                <a
                  href="https://t.me/+77016634352"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FaTelegram className="w-6 h-6" />
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=77016634352"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="mb-8 lg:mb-0">
              <h4 className="text-lg font-semibold mb-4">Быстрые ссылки</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="mb-8 lg:mb-0">
              <h4 className="text-lg font-semibold mb-4">Продукция</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Кровельные материалы
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Сайдинг
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Водосточные системы
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Комплектующие
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("contacts.title")}</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-start">
                  <Home className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  Астана, ул. Караменде би Шакаулы, 45
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +7 701 663 43 52
                </p>
                <p className="flex items-start">
                  <MessageSquare className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  {t("working_hours")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>© 2024 SmartBuildAstana. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      {/* Floating CTA Button */}
      <Button
        onClick={() => setIsRequestModalOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-lg z-30"
        size="lg"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {t("hero.cta_request")}
      </Button>
    </div>
  );
}