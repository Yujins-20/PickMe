// components/RankingResults.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Medal, Award, Share2, RotateCcw, ExternalLink, MapPin } from 'lucide-react';
import { EloItem } from '@/lib/algorithms/elo';
import EloRatingSystem from '@/lib/algorithms/elo';
import toast from 'react-hot-toast';

interface RankingResultsProps {
  items: EloItem[];
  roomTitle: string;
  roomCode: string;
  onRestart?: () => void;
}

export default function RankingResults({
  items,
  roomTitle,
  roomCode,
  onRestart,
}: RankingResultsProps) {
  const router = useRouter();
  const eloSystem = new EloRatingSystem();
  const ranking = eloSystem.getRanking(items);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${roomTitle} 투표 결과\n\n1위: ${ranking[0]?.name}\n2위: ${ranking[1]?.name}\n3위: ${ranking[2]?.name}\n\n#PickMe`;

    try {
      if (navigator.share) {
        await navigator.share({ title: roomTitle, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        toast.success('결과가 복사되었습니다!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    const badges = [
      'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
      'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
    ];
    return badges[rank] || 'bg-gray-100 text-gray-700';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Confetti Effect */}
        <div className="text-center mb-8 animate-slide-in-down">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            투표 완료!
          </h1>
          <p className="text-gray-600">{roomTitle}</p>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {/* 2nd Place */}
            {ranking[1] && (
              <div className="flex flex-col items-center pt-12">
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center w-full">
                  <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    {ranking[1].imageUrl ? (
                      <img
                        src={ranking[1].imageUrl}
                        alt={ranking[1].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🥈</span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">
                    {ranking[1].name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {Math.round(ranking[1].rating)} pts
                  </p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {ranking[0] && (
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-2xl shadow-xl p-4 text-center w-full border-4 border-yellow-400">
                  <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2 animate-pulse" />
                  <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    {ranking[0].imageUrl ? (
                      <img
                        src={ranking[0].imageUrl}
                        alt={ranking[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">🏆</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {ranking[0].name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {Math.round(ranking[0].rating)} pts
                  </p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {ranking[2] && (
              <div className="flex flex-col items-center pt-16">
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center w-full">
                  <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    {ranking[2].imageUrl ? (
                      <img
                        src={ranking[2].imageUrl}
                        alt={ranking[2].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🥉</span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">
                    {ranking[2].name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {Math.round(ranking[2].rating)} pts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Ranking */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">전체 순위</h2>
          <div className="space-y-3">
            {ranking.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  index < 3 ? 'bg-gradient-to-r ' + getRankBadge(index) : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 w-10 text-center">
                    {index < 3 ? (
                      getMedalIcon(index)
                    ) : (
                      <span
                        className={`text-xl font-bold ${
                          index < 3 ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        index < 3 ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        index < 3 ? 'text-white text-opacity-80' : 'text-gray-500'
                      }`}
                    >
                      {item.wins}승 {item.losses}패 · {item.comparisons} 비교
                    </p>
                  </div>
                  <div
                    className={`text-right ${
                      index < 3 ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    <div className="font-bold">{Math.round(item.rating)}</div>
                    <div className="text-xs opacity-75">점수</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleShare}
            className="px-6 py-4 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            결과 공유하기
          </button>
          {onRestart && (
            <button
              onClick={onRestart}
              className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              다시 투표하기
            </button>
          )}
        </div>

        {/* Winner Action */}
        {ranking[0] && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🎯 최종 선택: {ranking[0].name}
            </h3>
            <p className="text-gray-600 mb-4">
              이제 실행에 옮길 시간입니다!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const query = encodeURIComponent(ranking[0].name);
                  window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
                }}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                네이버 지도에서 보기
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold"
              >
                새로운 투표 만들기
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
