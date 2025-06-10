import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { submitRequest, type RequestFormData } from "@/lib/telegramApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Send } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

export default function Contacts() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<RequestFormData>({
    name: "",
    phone: "",
    comment: "",
  });

  const submitMutation = useMutation({
    mutationFn: submitRequest,
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: "Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
      });
      setFormData({ name: "", phone: "", comment: "" });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: t("common.error"),
        description: "Пожалуйста, заполните обязательные поля.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof RequestFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t("contacts.title")}
          </h1>
          <p className="text-xl text-gray-600">{t("contacts.subtitle")}</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Contact Information */}
          <div className="mb-8 lg:mb-0">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("contacts.info_title")}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {t("contacts.address_label")}
                      </h4>
                      <p className="text-gray-600">
                        Улица Караменде би Шакаулы, 45 офис
                        <br />
                        цокольный этаж, Астана
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {t("contacts.phone_label")}
                      </h4>
                      <a
                        href="tel:+77016634352"
                        className="text-brand-primary hover:text-brand-primary/80 transition-colors"
                      >
                        +7 701 663 43 52
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {t("contacts.hours_label")}
                      </h4>
                      <p className="text-gray-600">
                        Пн–Пт: 09:00–18:00
                        <br />
                        Сб: 09:00–14:00
                        <br />
                        Вс: выходной
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {t("contacts.social_title")}
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://t.me/+77016634352"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                    >
                      <FaTelegram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://api.whatsapp.com/send/?phone=77016634352"
                      className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("form.title")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t("form.name_label")}</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder={t("form.name_placeholder")}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">{t("form.phone_label")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder={t("form.phone_placeholder")}
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="comment">{t("form.comment_label")}</Label>
                    <Textarea
                      id="comment"
                      rows={4}
                      placeholder={t("form.comment_placeholder")}
                      value={formData.comment}
                      onChange={(e) =>
                        handleInputChange("comment", e.target.value)
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-secondary hover:bg-brand-secondary/90 text-white py-3 text-lg"
                    disabled={submitMutation.isPending}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {submitMutation.isPending
                      ? t("common.loading")
                      : t("form.submit")}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    {t("form.privacy")}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
