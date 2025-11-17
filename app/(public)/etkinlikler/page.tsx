import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, ExternalLink, Clock, Video } from 'lucide-react';

export default async function EtkinliklerPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('aktif_mi', true)
    .order('tarih', { ascending: true });

  // Geçmiş ve gelecek etkinlikleri ayır
  const now = new Date();
  const upcomingEvents = events?.filter(
    (event) => new Date(event.tarih) >= now
  );
  const pastEvents = events?.filter((event) => new Date(event.tarih) < now);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            <span>Etkinlikler</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Topluluk Etkinlikleri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zoom toplantıları, webinarlar ve diğer online etkinlikler
          </p>
        </div>

        {/* Content */}
        {!events || events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Yakında Duyurulacak
            </h2>
            <p className="text-gray-600">
              Henüz planlanmış etkinlik bulunmamaktadır. Yeni etkinlikler
              eklendiğinde burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Events */}
            {upcomingEvents && upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-green-600 rounded-full" />
                  Yaklaşan Etkinlikler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-xl transition-all"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="mb-2">
                              {event.baslik}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(event.tarih).toLocaleDateString(
                                  'tr-TR',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {event.aciklama && (
                          <p className="text-gray-600 mb-4">
                            {event.aciklama}
                          </p>
                        )}
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px]"
                        >
                          <span>Katıl</span>
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents && pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gray-400 rounded-full" />
                  Geçmiş Etkinlikler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="mb-2">
                              {event.baslik}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(event.tarih).toLocaleDateString(
                                  'tr-TR',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                      </CardHeader>
                      {event.aciklama && (
                        <CardContent>
                          <p className="text-gray-600">{event.aciklama}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
