import { useTranslation } from "@/lib/i18n";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: "5+", label: "лет опыта" },
    { value: "500+", label: "товаров" },
    { value: "1000+", label: "клиентов" },
    { value: "200+", label: "проектов" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {t("about.title")}
            </h1>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>{t("about.description1")}</p>
              <p>{t("about.description2")}</p>
              <p>{t("about.description3")}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              alt="Современное строительство с качественными материалами"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
