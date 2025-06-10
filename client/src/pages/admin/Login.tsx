import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface LoginData {
  username: string;
  password: string;
}

export default function Login() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: t("common.success"),
        description: "Вы успешно вошли в систему",
      });
      setLocation("/admin/dashboard");
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: t("common.error"),
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <User className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t("admin.login")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{t("admin.username")}</Label>
              <Input
                id="username"
                type="text"
                required
                placeholder="admin"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">{t("admin.password")}</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? t("common.loading")
                : t("admin.login_button")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
