import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { submitRequest, type RequestFormData } from "@/lib/telegramApi";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestModal({ isOpen, onClose }: RequestModalProps) {
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
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("form.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="comment">{t("form.comment_label")}</Label>
            <Textarea
              id="comment"
              rows={3}
              placeholder={t("form.comment_placeholder")}
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-secondary hover:bg-brand-secondary/90 text-white"
            disabled={submitMutation.isPending}
          >
            <Send className="w-4 h-4 mr-2" />
            {submitMutation.isPending ? t("common.loading") : t("form.submit")}
          </Button>

          <p className="text-sm text-gray-500 text-center">{t("form.privacy")}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
