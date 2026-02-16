// app/room/[code]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Share2, TrendingUp, Loader2, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase/client';
import EloRatingSystem, { EloItem } from '@/lib/algorithms/elo';
import GUROSampler, { ComparisonPair } from '@/lib/algorithms/guro';
import ComparisonCard from '@/components/ComparisonCard';
import RankingResults from '@/components/RankingResults';

export default function VotingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;

  const [room, setRoom] = useState<any>(null);
  const [items, setItems] = useState<EloItem[]>([]);
  const [currentPair, setCurrentPair] = useState<ComparisonPair | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [targetComparisons, setTargetComparisons] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const eloSystem = new EloRatingSystem(32);
  const guroSampler = new GUROSampler(eloSystem);

  // Load room and items
  useEffect(() => {
    loadRoom();
  }, [roomCode]);

  // Generate next pair when items change
  useEffect(() => {
    if (items.length >= 2 && !showResults) {
      const pair = guroSampler.selectNextPair(items);
      setCurrentPair(pair);

      // Calculate confidence
      const conf = guroSampler.calculateRankingConfidence(items);
      setConfidence(conf);

      // Auto-complete if converged
      if (guroSampler.hasConverged(items) || comparisonCount >= targetComparisons) {
        setShowResults(true);
      }
    }
  }, [items, comparisonCount]);

  const loadRoom = async () => {
    try {
      setIsLoading(true);

      // Fetch room
      const { data: roomData, error: roomError } = await supabase
        .from('voting_rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single();

      if (roomError) throw roomError;
      if (!roomData) {
        toast.error('투표방을 찾을 수 없습니다');
        router.push('/');
        return;
      }

      setRoom(roomData);

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('voting_items')
        .select('*')
        .eq('room_id', roomData.id);

      if (itemsError) throw itemsError;

      const eloItems: EloItem[] = itemsData.map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.image_url,
        rating: item.rating,
        comparisons: item.comparisons,
        wins: item.wins,
        losses: item.losses,
        metadata: item.metadata,
      }));

      setItems(eloItems);

      // Estimate required comparisons
      const target = guroSampler.estimateRequiredComparisons(eloItems.length, 0.90);
      setTargetComparisons(target);
    } catch (error) {
      console.error('Error loading room:', error);
      toast.error('투표방을 불러오는 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparison = async (winnerId: string, loserId: string) => {
    try {
      const winner = items.find((item) => item.id === winnerId);
      const loser = items.find((item) => item.id === loserId);

      if (!winner || !loser) return;

      // Update Elo ratings
      const { winner: updatedWinner, loser: updatedLoser } =
        eloSystem.updateRatings(winner, loser);

      // Update local state
      const updatedItems = items.map((item) => {
        if (item.id === winnerId) return updatedWinner;
        if (item.id === loserId) return updatedLoser;
        return item;
      });

      setItems(updatedItems);
      setComparisonCount((prev) => prev + 1);

      // Save to database
      await supabase.from('comparisons').insert({
        room_id: room.id,
        winner_id: winnerId,
        loser_id: loserId,
      });

      // Update item ratings in database
      await Promise.all([
        supabase
          .from('voting_items')
          .update({
            rating: updatedWinner.rating,
            comparisons: updatedWinner.comparisons,
            wins: updatedWinner.wins,
          })
          .eq('id', winnerId),
        supabase
          .from('voting_items')
          .update({
            rating: updatedLoser.rating,
            comparisons: updatedLoser.comparisons,
            losses: updatedLoser.losses,
          })
          .eq('id', loserId),
      ]);

      toast.success('선택이 반영되었습니다');
    } catch (error) {
      console.error('Error recording comparison:', error);
      toast.error('선택을 저장하는 중 오류가 발생했습니다');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('링크가 복사되었습니다!');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  const handleSkip = () => {
    if (items.length >= 2) {
      const pair = guroSampler.selectNextPair(items);
      setCurrentPair(pair);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-500" />
      </div>
    );
  }

  if (showResults) {
    return (
      <RankingResults
        items={items}
        roomTitle={room?.title}
        roomCode={roomCode}
        onRestart={() => {
          setShowResults(false);
          setComparisonCount(0);
        }}
      />
    );
  }

  const progress = Math.min(100, (comparisonCount / targetComparisons) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {room?.title}
              </h1>
              <p className="text-gray-600">
                방 코드: <span className="font-mono font-semibold">{roomCode}</span>
              </p>
            </div>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">공유</span>
            </button>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                진행률
              </span>
              <span className="text-sm text-gray-600">
                {comparisonCount} / {targetComparisons} 비교
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">
                  신뢰도: <span className="font-semibold">{confidence}%</span>
                </span>
              </div>
              <button
                onClick={() => setShowResults(true)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                지금 결과 보기
              </button>
            </div>
          </div>
        </div>

        {/* Comparison */}
        {currentPair ? (
          <ComparisonCard
            pair={currentPair}
            onSelect={handleComparison}
            onSkip={handleSkip}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              투표 완료!
            </h2>
            <p className="text-gray-600 mb-6">
              충분한 비교가 완료되었습니다
            </p>
            <button
              onClick={() => setShowResults(true)}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
            >
              결과 확인하기
            </button>
          </div>
        )}

        {/* Current Rankings Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">현재 순위 (중간 결과)</h3>
          <div className="space-y-2">
            {eloSystem
              .getRanking(items)
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.comparisons} 비교
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
