import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { MapPin, User } from 'lucide-react';
import { Profile } from '@/types';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link href={`/network/${profile.id}`}>
      <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
        <CardContent className="p-6 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.ad_soyad}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Name and Relationship */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {profile.ad_soyad}
            {profile.yakinlik_derecesi && (
              <span className="text-gray-600 font-normal"> ({profile.yakinlik_derecesi})</span>
            )}
          </h3>

          {/* Location and Age */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {profile.sehir}
              {profile.yas && ` • ${profile.yas} Yaşında`}
            </span>
          </div>

          {/* View Profile Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
              Profili Görüntüle →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
