import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <Button
        variant={language === "ru" ? "default" : "ghost"}
        size="sm"
        className={`px-3 py-1 text-sm font-medium ${
          language === "ru"
            ? "bg-brand-primary text-white hover:bg-brand-primary/90"
            : "text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => changeLanguage("ru")}
      >
        РУ
      </Button>
      <Button
        variant={language === "kz" ? "default" : "ghost"}
        size="sm"
        className={`px-3 py-1 text-sm font-medium ${
          language === "kz"
            ? "bg-brand-primary text-white hover:bg-brand-primary/90"
            : "text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => changeLanguage("kz")}
      >
        ҚЗ
      </Button>
    </div>
  );
}
