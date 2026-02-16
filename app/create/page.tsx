// app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, X, Search, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase/client';
import NaverSearchAPI from '@/lib/api/naver';

interface Item {
  id: string;
  name: string;
  imageUrl?: string;
}

const categoryNames: { [key: string]: string } = {
  lunch: '점심 메뉴',
  dinner: '저녁 메뉴',
  cafe: '카페/디저트',
  gathering: '회식 장소',
  weekend: '주말 활동',
};

export default function CreateRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'lunch';

  const [title, setTitle] = useState(categoryNames[category] || '나의 선택');
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showNaverSearch, setShowNaverSearch] = useState(false);

  const naverAPI = new NaverSearchAPI();

  const addItem = () => {
    if (!newItemName.trim()) {
      toast.error('항목 이름을 입력하세요');
      return;
    }

    const newItem: Item = {
      id: `item_${Date.now()}`,
      name: newItemName.trim(),
    };

    setItems([...items, newItem]);
    setNewItemName('');
    toast.success('항목이 추가되었습니다');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleNaverSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('검색어를 입력하세요');
      return;
    }

    setIsSearching(true);
    try {
      const query = searchLocation
        ? `${searchLocation} ${searchQuery}`
        : searchQuery;
      
      const places = await naverAPI.searchLocal(query, 10);

      if (places.length === 0) {
        toast.error('검색 결과가 없습니다');
        return;
      }

      const newItems: Item[] = places.map((place, index) => ({
        id: `naver_${Date.now()}_${index}`,
        name: place.title,
        imageUrl: undefined, // Will be filled with placeholder or actual image
      }));

      setItems([...items, ...newItems]);
      toast.success(`${places.length}개의 맛집을 추가했습니다`);
      setShowNaverSearch(false);
      setSearchQuery('');
      setSearchLocation('');
    } catch (error) {
      console.error('Naver search error:', error);
      toast.error('검색 중 오류가 발생했습니다');
    } finally {
      setIsSearching(false);
    }
  };

  const createRoom = async () => {
    if (items.length < 2) {
      toast.error('최소 2개 이상의 항목이 필요합니다');
      return;
    }

    setIsCreating(true);
    try {
      // Generate room code
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create room in Supabase
      const { data: room, error: roomError } = await supabase
        .from('voting_rooms')
        .insert({
          room_code: roomCode,
          title,
          category,
          status: 'active',
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Create items
      const itemsToInsert = items.map((item) => ({
        room_id: room.id,
        name: item.name,
        image_url: item.imageUrl || null,
        rating: 1500,
        comparisons: 0,
        wins: 0,
        losses: 0,
      }));

      const { error: itemsError } = await supabase
        .from('voting_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.success('투표방이 생성되었습니다!');
      router.push(`/room/${roomCode}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('투표방 생성 중 오류가 발생했습니다');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">투표 만들기</h1>
          <p className="text-gray-600 mt-2">선택할 항목들을 추가하세요</p>
        </div>

        {/* Title Input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="예: 오늘 점심 메뉴"
          />
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              항목 목록 ({items.length})
            </h2>
            <button
              onClick={() => setShowNaverSearch(!showNaverSearch)}
              className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              {showNaverSearch ? '직접 입력' : '맛집 검색'}
            </button>
          </div>

          {/* Naver Search */}
          {showNaverSearch && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="지역 (예: 강남)"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNaverSearch()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="음식 종류 (예: 돈까스)"
                  />
                </div>
              </div>
              <button
                onClick={handleNaverSearch}
                disabled={isSearching}
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    검색 중...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    네이버에서 맛집 검색
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manual Add */}
          {!showNaverSearch && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="항목 이름 입력 (예: 짜장면)"
              />
              <button
                onClick={addItem}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                추가
              </button>
            </div>
          )}

          {/* Items */}
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>아직 항목이 없습니다</p>
                <p className="text-sm mt-1">위에서 항목을 추가해주세요</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900">{item.name}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={createRoom}
          disabled={items.length < 2 || isCreating}
          className="w-full px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              생성 중...
            </>
          ) : (
            <>투표 시작하기</>
          )}
        </button>

        {items.length < 2 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            최소 2개 이상의 항목이 필요합니다
          </p>
        )}
      </div>
    </main>
  );
}
