'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import {
  Check,
  X,
  User,
  MapPin,
  Loader2,
  Edit,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
} from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
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
    onay_durumu: 'beklemede' as 'beklemede' | 'onaylandı' | 'reddedildi',
  });

  const tabs = [
    { id: 'beklemede' as TabType, label: 'Bekleyenler', count: profiles.filter(p => p.onay_durumu === 'beklemede').length, color: 'amber' },
    { id: 'onaylandı' as TabType, label: 'Onaylananlar', count: profiles.filter(p => p.onay_durumu === 'onaylandı').length, color: 'emerald' },
    { id: 'reddedildi' as TabType, label: 'Reddedilenler', count: profiles.filter(p => p.onay_durumu === 'reddedildi').length, color: 'red' },
    { id: 'all' as TabType, label: 'Tümü', count: profiles.length, color: 'slate' },
  ];

  const filteredProfiles = profiles
    .filter((profile) => {
      const matchesTab = activeTab === 'all' || profile.onay_durumu === activeTab;
      const matchesSearch = !searchTerm ||
        profile.ad_soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.sehir.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      // Always sort by display_order first
      const orderA = a.display_order ?? 999999;
      const orderB = b.display_order ?? 999999;
      if (orderA !== orderB) return orderA - orderB;
      // Then by created_at
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  const handleApprove = async (profileId: string) => {
    setLoading(profileId);
    try {
      await supabase.from('profiles').update({ onay_durumu: 'onaylandı' }).eq('id', profileId);
      router.refresh();
    } catch (error) {
      alert('Onaylama sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (profileId: string) => {
    if (!confirm('Bu profili reddetmek istediğinizden emin misiniz?')) return;
    setLoading(profileId);
    try {
      await supabase.from('profiles').update({ onay_durumu: 'reddedildi' }).eq('id', profileId);
      router.refresh();
    } catch (error) {
      alert('Reddetme sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (profileId: string) => {
    if (!confirm('Bu profili kalıcı olarak silmek istediğinizden emin misiniz?')) return;
    setLoading(profileId);
    try {
      await supabase.from('profiles').delete().eq('id', profileId);
      router.refresh();
    } catch (error) {
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
      await supabase.from('profiles').update({
        ad_soyad: formData.ad_soyad,
        yas: formData.yas ? parseInt(formData.yas) : null,
        yakinlik_derecesi: formData.yakinlik_derecesi || null,
        sehir: formData.sehir,
        hikayem_text: formData.hikayem_text || null,
        yetkinlikler_cv: formData.yetkinlikler_cv || null,
        onay_durumu: formData.onay_durumu,
      }).eq('id', editingProfile.id);
      setEditingProfile(null);
      router.refresh();
    } catch (error) {
      alert('Güncelleme sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const handleCreate = async () => {
    setLoading('create');
    try {
      await supabase.from('profiles').insert([{
        user_id: '00000000-0000-0000-0000-000000000000',
        ad_soyad: formData.ad_soyad,
        yas: formData.yas ? parseInt(formData.yas) : null,
        yakinlik_derecesi: formData.yakinlik_derecesi || null,
        sehir: formData.sehir,
        hikayem_text: formData.hikayem_text || null,
        yetkinlikler_cv: formData.yetkinlikler_cv || null,
        onay_durumu: formData.onay_durumu,
      }]);
      setShowCreateModal(false);
      resetForm();
      router.refresh();
    } catch (error) {
      alert('Oluşturma sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      ad_soyad: '', yas: '', yakinlik_derecesi: '', sehir: '',
      hikayem_text: '', yetkinlikler_cv: '', onay_durumu: 'beklemede',
    });
  };

  const handleMoveUp = async (profileId: string) => {
    const currentIndex = filteredProfiles.findIndex(p => p.id === profileId);
    if (currentIndex <= 0) return;
    setLoading(profileId);
    try {
      const current = filteredProfiles[currentIndex];
      const above = filteredProfiles[currentIndex - 1];
      // Swap display_order values
      const currentOrder = current.display_order ?? currentIndex + 1;
      const aboveOrder = above.display_order ?? currentIndex;
      await supabase.from('profiles').update({ display_order: aboveOrder }).eq('id', current.id);
      await supabase.from('profiles').update({ display_order: currentOrder }).eq('id', above.id);
      router.refresh();
    } catch { alert('Sıralama hatası'); }
    finally { setLoading(null); }
  };

  const handleMoveDown = async (profileId: string) => {
    const currentIndex = filteredProfiles.findIndex(p => p.id === profileId);
    if (currentIndex >= filteredProfiles.length - 1) return;
    setLoading(profileId);
    try {
      const current = filteredProfiles[currentIndex];
      const below = filteredProfiles[currentIndex + 1];
      // Swap display_order values
      const currentOrder = current.display_order ?? currentIndex + 1;
      const belowOrder = below.display_order ?? currentIndex + 2;
      await supabase.from('profiles').update({ display_order: belowOrder }).eq('id', current.id);
      await supabase.from('profiles').update({ display_order: currentOrder }).eq('id', below.id);
      router.refresh();
    } catch { alert('Sıralama hatası'); }
    finally { setLoading(null); }
  };

  return (
    <div className="space-y-6">
      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Create */}
          <div className="flex gap-3 lg:ml-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => { resetForm(); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profiles List */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Profil Bulunamadı</h3>
          <p className="text-slate-500">Bu kategoride profil bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProfiles.map((profile, index) => (
            <div
              key={profile.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex-shrink-0">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.ad_soyad}
                        fill
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{profile.ad_soyad.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Number */}
                  <div className="hidden sm:flex w-10 h-10 bg-slate-100 rounded-lg items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-slate-500">#{index + 1}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="sm:hidden text-xs font-medium text-slate-400">#{index + 1}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{profile.ad_soyad}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${profile.onay_durumu === 'onaylandı' ? 'bg-emerald-100 text-emerald-700' :
                        profile.onay_durumu === 'beklemede' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {profile.onay_durumu === 'onaylandı' ? 'Onaylı' :
                          profile.onay_durumu === 'beklemede' ? 'Bekliyor' : 'Reddedildi'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {profile.sehir}
                      </span>
                      {profile.yas && <span>Yaş: {profile.yas}</span>}
                      {profile.yakinlik_derecesi && <span>{profile.yakinlik_derecesi}</span>}
                      <span>{new Date(profile.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    {/* Ordering buttons - visible for all profiles */}
                    <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                      <button
                        onClick={() => handleMoveUp(profile.id)}
                        disabled={loading === profile.id || index === 0}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Yukarı Taşı"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(profile.id)}
                        disabled={loading === profile.id || index === filteredProfiles.length - 1}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Aşağı Taşı"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {profile.onay_durumu === 'beklemede' && (
                      <>
                        <button
                          onClick={() => handleApprove(profile.id)}
                          disabled={loading === profile.id}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Onayla"
                        >
                          {loading === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleReject(profile.id)}
                          disabled={loading === profile.id}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reddet"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(profile.id)}
                      disabled={loading === profile.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Content */}
                {(profile.hikayem_text || profile.yetkinlikler_cv) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {profile.hikayem_text && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Hikaye</p>
                        <p className="text-sm text-slate-700 line-clamp-3">{profile.hikayem_text}</p>
                      </div>
                    )}
                    {profile.yetkinlikler_cv && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Yetkinlikler</p>
                        <p className="text-sm text-slate-700 line-clamp-2">{profile.yetkinlikler_cv}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {(editingProfile || showCreateModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProfile ? 'Profil Düzenle' : 'Yeni Profil Oluştur'}
              </h2>
              <button
                onClick={() => { setEditingProfile(null); setShowCreateModal(false); }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Ad Soyad"
                  value={formData.ad_soyad}
                  onChange={(e) => setFormData({ ...formData, ad_soyad: e.target.value })}
                  required
                />
                <Input
                  label="Şehir"
                  value={formData.sehir}
                  onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
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
              </div>
              <Textarea
                label="FA Hikayem"
                value={formData.hikayem_text}
                onChange={(e) => setFormData({ ...formData, hikayem_text: e.target.value })}
                rows={4}
              />
              <Textarea
                label="Yetkinlikler"
                value={formData.yetkinlikler_cv}
                onChange={(e) => setFormData({ ...formData, yetkinlikler_cv: e.target.value })}
                rows={3}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Onay Durumu</label>
                <select
                  value={formData.onay_durumu}
                  onChange={(e) => setFormData({ ...formData, onay_durumu: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beklemede">Beklemede</option>
                  <option value="onaylandı">Onaylandı</option>
                  <option value="reddedildi">Reddedildi</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={editingProfile ? handleUpdate : handleCreate}
                disabled={loading === (editingProfile?.id || 'create')}
                className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Kaydediliyor...' : editingProfile ? 'Güncelle' : 'Oluştur'}
              </button>
              <button
                onClick={() => { setEditingProfile(null); setShowCreateModal(false); }}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
