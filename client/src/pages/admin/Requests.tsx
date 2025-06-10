import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { type Request } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Calendar, User } from "lucide-react";

export default function Requests() {
  const { t } = useTranslation();

  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Заявки клиентов</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          Всего: {requests.length}
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Заявок пока нет
            </h3>
            <p className="text-gray-500">
              Когда клиенты отправят заявки, они появятся здесь
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((request, index) => (
              <Card 
                key={request.id} 
                className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5 text-brand-primary" />
                      {request.name}
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(request.created_at).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-brand-primary" />
                    <a 
                      href={`tel:${request.phone}`}
                      className="font-medium hover:text-brand-primary transition-colors"
                    >
                      {request.phone}
                    </a>
                  </div>
                  
                  {request.comment && (
                    <div className="flex gap-2 text-gray-700">
                      <MessageSquare className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Комментарий:</p>
                        <p className="text-gray-800 leading-relaxed">{request.comment}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}