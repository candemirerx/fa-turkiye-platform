'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Check, X, User, MapPin, Loader2, Edit, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface ProfileManagementProps {
    profiles: Profile[];
}

type TabType = 'beklemede' | 'onaylandı' | 'reddedildi' | 'all';

export default function ProfileManagement({ profiles }: ProfileManagementProps) {
    const router = useRouter();
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<TabType>('beklemede');
    const [loading, setLoading] = useState<string | null>(null);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        ad_soyad: '',
        yas: '',
        yakinlik_derecesi: '',
        sehir: '',
        hikayem_text: '',
        yetkinlikler_cv: '',
        onay_durumu: 'beklemede' as const,
    });

    // Filtreleme
    const filteredProfiles = profiles.filter((profile) => {
        if (activeTab === 'all') return true;
        return profile.onay_durumu === activeTab;
    });

    const tabs = [
        { id: 'beklemede' as TabType, label: 'Bekleyenler', count: profiles.filter(p => p.onay_durumu === 'beklemede').length },
        { id: 'onaylandı' as TabType, label: 'Onaylananlar', count: profiles.filter(p => p.onay_durumu === 'onaylandı').length },
        { id: 'reddedildi' as TabType, label: 'Reddedilenler', count: profiles.filter(p => p.onay_durumu === 'reddedildi').length },
        { id: 'all' as TabType, label: 'Tümü', count: profiles.length },
    ];

    const handleApprove = async (profileId: string) => {
        setLoading(profileId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ onay_durumu: 'onaylandı' })
                .eq('id', profileId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error('Approve error:', error);
            alert('Onaylama sırasında hata oluştu');
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async (profileId: string) => {
        if (!confirm('Bu profili reddetmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(profileId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ onay_durumu: 'reddedildi' })
                .eq('id', profileId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error('Reject error:', error);
            alert('Reddetme sırasında hata oluştu');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (profileId: string) => {
        if (!confirm('Bu profili kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
            return;
        }

        setLoading(profileId);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', profileId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Silme sırasında hata oluştu');
        } finally {
            setLoading(null);
        }
    };

    const handleEdit = (profile: Profile) => {
        setEditingProfile(profile);
        setFormData({
            ad_soyad: profile.ad_soyad,
            yas: profile.yas?.toString() || '',
            yakinlik_derecesi: profile.yakinlik_derecesi || '',
            sehir: profile.sehir,
            hikayem_text: profile.hikayem_text || '',
            yetkinlikler_cv: profile.yetkinlikler_cv || '',
            onay_durumu: profile.onay_durumu,
        });
    };

    const handleUpdate = async () => {
        if (!editingProfile) return;

        setLoading(editingProfile.id);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ad_soyad: formData.ad_soyad,
                    yas: formData.yas ? parseInt(formData.yas) : null,
                    yakinlik_derecesi: formData.yakinlik_derecesi || null,
                    sehir: formData.sehir,
                    hikayem_text: formData.hikayem_text || null,
                    yetkinlikler_cv: formData.yetkinlikler_cv || null,
                    onay_durumu: formData.onay_durumu,
                })
                .eq('id', editingProfile.id);

            if (error) throw error;

            setEditingProfile(null);
            router.refresh();
        } catch (error) {
            console.error('Update error:', error);
            alert('Güncelleme sırasında hata oluştu');
        } finally {
            setLoading(null);
        }
    };

    const handleCreate = async () => {
        setLoading('create');
        try {
            // Admin için dummy user_id kullan
            const { error } = await supabase
                .from('profiles')
                .insert([{
                    user_id: '00000000-0000-0000-0000-000000000000', // Dummy admin user_id
                    ad_soyad: formData.ad_soyad,
                    yas: formData.yas ? parseInt(formData.yas) : null,
                    yakinlik_derecesi: formData.yakinlik_derecesi || null,
                    sehir: formData.sehir,
                    hikayem_text: formData.hikayem_text || null,
                    yetkinlikler_cv: formData.yetkinlikler_cv || null,
                    onay_durumu: formData.onay_durumu,
                }]);

            if (error) throw error;

            setShowCreateModal(false);
            setFormData({
                ad_soyad: '',
                yas: '',
                yakinlik_derecesi: '',
                sehir: '',
                hikayem_text: '',
                yetkinlikler_cv: '',
                onay_durumu: 'beklemede',
            });
            router.refresh();
        } catch (error) {
            console.error('Create error:', error);
            alert('Oluşturma sırasında hata oluştu');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div>
            {/* Header with Create Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Profil Oluştur
                </Button>
            </div>

            {/* Profiles List */}
            {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Profil Bulunamadı
                    </h2>
                    <p className="text-gray-600">
                        Bu kategoride profil bulunmuyor.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredProfiles.map((profile) => (
                        <Card key={profile.id}>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-16 h-16 relative flex-shrink-0">
                                        {profile.avatar_url ? (
                                            <Image
                                                src={profile.avatar_url}
                                                alt={profile.ad_soyad}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <CardTitle className="mb-2">{profile.ad_soyad}</CardTitle>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{profile.sehir}</span>
                                            </div>
                                            {profile.yas && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="w-4 h-4" />
                                                    <span>Yaş: {profile.yas}</span>
                                                </div>
                                            )}
                                            {profile.yakinlik_derecesi && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <span className="text-sm">
                                                        <strong>Yakınlık:</strong> {profile.yakinlik_derecesi}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${profile.onay_durumu === 'onaylandı'
                                                    ? 'bg-green-100 text-green-700'
                                                    : profile.onay_durumu === 'beklemede'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                {profile.onay_durumu === 'onaylandı' ? 'Onaylandı' :
                                                    profile.onay_durumu === 'beklemede' ? 'Beklemede' : 'Reddedildi'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEdit(profile)}
                                            disabled={loading === profile.id}
                                            size="sm"
                                            variant="outline"
                                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </Button>
                                        {profile.onay_durumu === 'beklemede' && (
                                            <>
                                                <Button
                                                    onClick={() => handleApprove(profile.id)}
                                                    disabled={loading === profile.id}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {loading === profile.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Onayla
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(profile.id)}
                                                    disabled={loading === profile.id}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Reddet
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(profile.id)}
                                            disabled={loading === profile.id}
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Details */}
                            {(profile.hikayem_text || profile.yetkinlikler_cv) && (
                                <CardContent className="space-y-4">
                                    {profile.hikayem_text && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Hikaye:</h4>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {profile.hikayem_text}
                                            </p>
                                        </div>
                                    )}
                                    {profile.yetkinlikler_cv && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Yetkinlikler:
                                            </h4>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {profile.yetkinlikler_cv}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Profil Düzenle
                        </h2>
                        <div className="space-y-4">
                            <Input
                                label="Ad Soyad"
                                value={formData.ad_soyad}
                                onChange={(e) => setFormData({ ...formData, ad_soyad: e.target.value })}
                                required
                            />
                            <Input
                                label="Yaş"
                                type="number"
                                value={formData.yas}
                                onChange={(e) => setFormData({ ...formData, yas: e.target.value })}
                            />
                            <Input
                                label="Yakınlık Derecesi"
                                value={formData.yakinlik_derecesi}
                                onChange={(e) => setFormData({ ...formData, yakinlik_derecesi: e.target.value })}
                            />
                            <Input
                                label="Şehir"
                                value={formData.sehir}
                                onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
                                required
                            />
                            <Textarea
                                label="FA Hikayem"
                                value={formData.hikayem_text}
                                onChange={(e) => setFormData({ ...formData, hikayem_text: e.target.value })}
                                rows={6}
                            />
                            <Textarea
                                label="Yetkinlikler & Deneyim"
                                value={formData.yetkinlikler_cv}
                                onChange={(e) => setFormData({ ...formData, yetkinlikler_cv: e.target.value })}
                                rows={4}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Onay Durumu
                                </label>
                                <select
                                    value={formData.onay_durumu}
                                    onChange={(e) => setFormData({ ...formData, onay_durumu: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="beklemede">Beklemede</option>
                                    <option value="onaylandı">Onaylandı</option>
                                    <option value="reddedildi">Reddedildi</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button
                                onClick={handleUpdate}
                                disabled={loading === editingProfile.id}
                                className="flex-1"
                            >
                                {loading === editingProfile.id ? 'Güncelleniyor...' : 'Güncelle'}
                            </Button>
                            <Button
                                onClick={() => setEditingProfile(null)}
                                variant="outline"
                                disabled={loading === editingProfile.id}
                            >
                                İptal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Yeni Profil Oluştur
                        </h2>
                        <div className="space-y-4">
                            <Input
                                label="Ad Soyad"
                                value={formData.ad_soyad}
                                onChange={(e) => setFormData({ ...formData, ad_soyad: e.target.value })}
                                required
                            />
                            <Input
                                label="Yaş"
                                type="number"
                                value={formData.yas}
                                onChange={(e) => setFormData({ ...formData, yas: e.target.value })}
                            />
                            <Input
                                label="Yakınlık Derecesi"
                                value={formData.yakinlik_derecesi}
                                onChange={(e) => setFormData({ ...formData, yakinlik_derecesi: e.target.value })}
                            />
                            <Input
                                label="Şehir"
                                value={formData.sehir}
                                onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
                                required
                            />
                            <Textarea
                                label="FA Hikayem"
                                value={formData.hikayem_text}
                                onChange={(e) => setFormData({ ...formData, hikayem_text: e.target.value })}
                                rows={6}
                            />
                            <Textarea
                                label="Yetkinlikler & Deneyim"
                                value={formData.yetkinlikler_cv}
                                onChange={(e) => setFormData({ ...formData, yetkinlikler_cv: e.target.value })}
                                rows={4}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Onay Durumu
                                </label>
                                <select
                                    value={formData.onay_durumu}
                                    onChange={(e) => setFormData({ ...formData, onay_durumu: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="beklemede">Beklemede</option>
                                    <option value="onaylandı">Onaylandı</option>
                                    <option value="reddedildi">Reddedildi</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button
                                onClick={handleCreate}
                                disabled={loading === 'create'}
                                className="flex-1"
                            >
                                {loading === 'create' ? 'Oluşturuluyor...' : 'Oluştur'}
                            </Button>
                            <Button
                                onClick={() => setShowCreateModal(false)}
                                variant="outline"
                                disabled={loading === 'create'}
                            >
                                İptal
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
