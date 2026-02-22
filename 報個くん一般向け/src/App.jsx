import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  FileText,
  Clock,
  TrendingDown,
  CheckCircle2,
  Send,
  ArrowRight,
  UserCheck,
  Zap,
  Menu,
  X,
  Truck,
  Smartphone,
  Laptop,
  ChevronRight,
  Coins,
  AlertTriangle,
  Users,
  Target
} from 'lucide-react';

/**
 * ScrollReveal コンポーネント
 * スクロール時にフェードインアニメーションを適用
 */
const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-12"
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * アニメーション背景コンポーネント
 * ゆっくり動く背景要素
 */
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-sky-200/40 blur-[100px] animate-blob mix-blend-multiply filter"></div>
    <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-indigo-200/40 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply filter"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-purple-200/40 blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply filter"></div>
    <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
  </div>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const twitterLink = "https://twitter.com";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-600 selection:bg-sky-200 selection:text-sky-900 overflow-x-hidden">

      {/* カスタムアニメーション用スタイル */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <AnimatedBackground />

      {/* ナビゲーション */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${scrolled || isMenuOpen
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 py-2"
          : "bg-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-sky-200/50 group-hover:scale-105 transition-transform duration-300">
                <FileText className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">報個くん</span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {['特徴', '対応業務', '導入効果', '価格'].map((item, i) => {
                const id = ['features', 'flexibility', 'impact', 'pricing'][i];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(id)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-white/50 rounded-full transition-all"
                  >
                    {item}
                  </button>
                );
              })}
              <div className="pl-4 ml-2 border-l border-slate-200/60">
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Send size={16} />
                  無料デモを申し込む
                </a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-slate-100 shadow-xl">
            <div className="p-4 space-y-2">
              {['特徴', '対応業務', '導入効果', '価格'].map((item, i) => {
                const id = ['features', 'flexibility', 'impact', 'pricing'][i];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(id)}
                    className="block w-full text-left px-4 py-3 text-slate-600 hover:bg-sky-50/50 hover:text-sky-600 rounded-xl font-medium transition-colors"
                  >
                    {item}
                  </button>
                );
              })}
              <div className="pt-2">
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-bold shadow-md"
                >
                  無料デモを申し込む
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ヒーローセクション */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            <div className="lg:w-1/2 text-center lg:text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sky-700 text-sm font-semibold mb-8 border border-white/60 shadow-sm hover:scale-105 transition-transform duration-300 cursor-default">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  軽貨物・業務委託ドライバーを抱える会社様向け
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-4 drop-shadow-sm">
                  週<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">4時間</span>の経理を、<br />
                  週<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 animate-gradient-x">10分</span>へ。
                </h1>
                <p className="text-xl lg:text-2xl font-bold text-slate-700 mb-6">
                  委託料計算と振込明細を完全自動化。
                </p>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0 glass-panel p-4 rounded-2xl border-none bg-white/40">
                  経理作業を<span className="font-bold text-sky-600">96%削減</span>するWebツール。<br />
                  ドライバーの日報入力から委託料計算、振込明細PDF発行までワンストップで自動化します。
                </p>

                <div className="mb-8 max-w-lg mx-auto lg:mx-0 bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-100 rounded-xl p-4 shadow-sm">
                  <p className="text-slate-700 font-medium leading-relaxed">
                    月16時間浮けば、新規営業やドライバーとの関係構築に時間を使えます。<br />
                    <span className="font-bold text-indigo-700 underline decoration-indigo-300 decoration-2">その差が、売上の差になります。</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href={twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-full font-bold text-lg shadow-xl shadow-sky-500/30 hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    無料デモを申し込む
                  </a>
                  <p className="text-xs text-slate-500 mt-2 text-center lg:text-left font-medium">
                    ※売り込みはしません。まずは画面をご覧ください。
                  </p>
                  <button
                    onClick={() => scrollToSection('impact')}
                    className="px-8 py-4 glass-card text-slate-700 hover:bg-white hover:text-sky-600 rounded-full font-bold text-lg transition-all"
                  >
                    導入効果を見る
                  </button>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:w-1/2 w-full perspective-1000">
              <ScrollReveal delay={200}>
                <div className="relative transform transition-transform duration-700 hover:rotate-y-2">
                  {/* 装飾要素 */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-sky-200 to-transparent opacity-30 rounded-full blur-2xl"></div>

                  {/* メインのグラスカード */}
                  <div className="relative glass-panel rounded-3xl overflow-hidden p-6 sm:p-8 shadow-2xl shadow-sky-900/10">
                    {/* UIモックアップ */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Dashboard</p>
                          <p className="text-lg font-bold text-slate-800">今月の売上報告</p>
                        </div>
                        <div className="bg-green-100/80 backdrop-blur-sm text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                          自動集計中
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl p-4 shadow-sm border border-slate-100">
                          <p className="text-sky-600 text-xs font-bold mb-1">個数建て</p>
                          <p className="text-2xl font-bold text-slate-800">1,240<span className="text-sm text-slate-500 font-normal ml-1">個</span></p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-4 shadow-sm border border-slate-100">
                          <p className="text-indigo-600 text-xs font-bold mb-1">車建て（チャーター）</p>
                          <p className="text-2xl font-bold text-slate-800">12<span className="text-sm text-slate-500 font-normal ml-1">日</span></p>
                        </div>
                      </div>

                      <div className="bg-white/60 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-inner">A</div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">佐藤 ドライバー</p>
                              <p className="text-xs text-slate-400">振込明細書発行済み</p>
                            </div>
                          </div>
                          <FileText className="text-sky-500 h-5 w-5" />
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 w-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* フローティングバッジ */}
                  <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                    <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-full p-2 shadow-lg shadow-green-200">
                      <CheckCircle2 className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                      <p className="text-sm font-bold text-slate-800">計算完了！</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 導入実例セクション */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border-white/50 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">導入実例</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">月16時間の業務削減に成功</h3>
                  <p className="text-slate-600 leading-relaxed">
                    実際に軽貨物会社で導入し、週<span className="font-bold text-slate-900">4時間</span>かかっていた経理業務が
                    週<span className="font-bold text-sky-600">10分</span>へ改善。
                    月<span className="font-bold text-slate-900">16時間</span>の業務削減に成功しました。
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ターゲット明確化バナー */}
      <section className="py-8 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-sky-50/80 backdrop-blur-sm rounded-2xl border border-sky-100">
              <Target className="text-sky-500 flex-shrink-0" size={20} />
              <p className="text-slate-700 font-bold text-center">
                対象：<span className="text-sky-600">軽貨物・業務委託ドライバーを5名以上抱える会社様</span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 柔軟な対応セクション（個数 & 車建て） */}
      <section id="flexibility" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 drop-shadow-sm">
                あらゆる契約形態にフィット
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg glass-panel p-4 rounded-xl inline-block border-white/50">
                ドライバーごとに異なる契約内容も、報個くんなら簡単に設定可能。<br className="hidden sm:block" />
                複雑な計算ロジックにも対応しています。
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="glass-card rounded-[2rem] p-8 hover:shadow-2xl hover:border-sky-200 transition-all duration-300 group hover:-translate-y-2">
                <div className="h-16 w-16 bg-gradient-to-br from-sky-100 to-white rounded-2xl flex items-center justify-center mb-6 text-sky-600 shadow-md group-hover:scale-110 transition-transform border border-sky-50">
                  <Coins size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">個数単価の仕事</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  「1個あたり◯◯円」という出来高制の業務に対応。
                  商品種別ごとの単価設定や、時間帯別の割増計算なども柔軟に対応可能です。
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['宅配', 'ネットスーパー', 'ポスティング'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/80 border border-slate-100 text-slate-600 text-xs font-bold rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="glass-card rounded-[2rem] p-8 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 group hover:-translate-y-2">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-white rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-md group-hover:scale-110 transition-transform border border-indigo-50">
                  <Truck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">車建て・1日単価の仕事</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  「1日あたり◯◯円」「半日チャーター」などの固定報酬制に対応。
                  残業代の追加計算や、高速代などの経費精算も合わせて管理できます。
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['企業配', 'スポットチャーター', '定期便'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/80 border border-slate-100 text-slate-600 text-xs font-bold rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* マルチデバイス対応セクション */}
      <section className="py-24 relative overflow-hidden">
        {/* 背景の装飾 */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <ScrollReveal>
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl shadow-sky-900/20 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                  <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-50 relative">
                    {/* スクリーンコンテンツモックアップ */}
                    <div className="bg-sky-500 h-24 w-full pt-10 px-4 flex justify-between items-start text-white">
                      <Menu size={20} />
                      <span className="font-bold">入力画面</span>
                      <div className="w-5"></div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold mb-2">本日の日付</p>
                        <div className="h-8 bg-slate-100 rounded w-full"></div>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold mb-2">配達個数</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-slate-800">128</span>
                          <span className="text-sm text-slate-500">個</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl py-3 text-center font-bold shadow-lg shadow-sky-200">
                        報告する
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <ScrollReveal delay={200}>
                <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-wider uppercase text-indigo-500 bg-indigo-50/80 backdrop-blur-sm rounded-full border border-indigo-100">
                  Multi-Device Support
                </div>
                <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight drop-shadow-sm">
                  いつでも、どこでも。<br />
                  好きなデバイスで。
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed glass-panel p-6 rounded-2xl border-white/50 bg-white/40">
                  報個くんはブラウザで動くWebアプリケーション。
                  専用アプリのインストールは不要です。<br /><br />
                  ドライバーは自分のスマホ（iPhone / Android）から日報を入力。
                  管理者はスマホでもPCの大画面でも集計データを確認OK。
                  デバイスを選ばない自由な働き方をサポートします。
                </p>

                <div className="flex gap-8 border-t border-slate-200/50 pt-8">
                  <div className="flex flex-col gap-2 group">
                    <div className="p-2 rounded-lg bg-white/50 group-hover:bg-sky-50 transition-colors w-fit">
                      <Smartphone className="h-8 w-8 text-slate-800 group-hover:text-sky-600 transition-colors" />
                    </div>
                    <span className="font-bold text-sm text-slate-600">スマホ対応</span>
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <div className="p-2 rounded-lg bg-white/50 group-hover:bg-sky-50 transition-colors w-fit">
                      <Laptop className="h-8 w-8 text-slate-800 group-hover:text-sky-600 transition-colors" />
                    </div>
                    <span className="font-bold text-sm text-slate-600">PC対応</span>
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <div className="h-12 w-12 flex items-center justify-center font-bold text-lg text-slate-800 border-2 border-slate-800 rounded-xl bg-white/50 group-hover:border-sky-500 group-hover:text-sky-500 transition-all">W</div>
                    <span className="font-bold text-sm text-slate-600">インストール不要</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 導入効果セクション */}
      <section id="impact" className="py-24 relative overflow-hidden">
        {/* ダークテーマオーバーレイ */}
        <div className="absolute inset-0 bg-slate-900/95 -z-10"></div>
        {/* カラフルな装飾 */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">劇的な業務改善効果</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                単純作業はシステムに任せて、<br className="sm:hidden" />あなたは経営やドライバーとの対話に集中しませんか？
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal delay={100}>
              <div className="space-y-12">
                <div className="flex gap-6 group">
                  <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="text-sky-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">週4時間 → たった10分に</h3>
                    <p className="text-slate-400 leading-relaxed">
                      手作業やExcel管理にかかっていた時間を約96%削減。
                      空いた時間で新規案件の獲得や、ドライバーのフォローに回せます。
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown className="text-sky-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">計算ミスによる信頼低下をゼロへ</h3>
                    <p className="text-slate-400 leading-relaxed">
                      「計算式が間違っていた」「入力ミスで金額が合わない」<br />
                      ドライバーからの信頼を損なうトラブルを根本から解決します。
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown className="text-green-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">月16時間の業務削減 = 利益改善</h3>
                    <p className="text-slate-400 leading-relaxed">
                      経理にかけていた時間がそのまま利益に直結。
                      事務員を雇うコスト（月15〜20万円）と比較してみてください。
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
                <p className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Time Saving</p>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Before（Excel手計算）</span>
                      <span className="font-mono text-slate-300">週240 min</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                      <div className="bg-slate-500 h-full w-full rounded-full"></div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-sky-400 font-bold">After（報個くん）</span>
                      <span className="font-mono text-sky-400 font-bold">週10 min</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                      <div className="bg-sky-500 h-full w-[4%] rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)]"></div>
                    </div>
                    <div className="absolute right-0 -top-8 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg transform translate-x-2 animate-pulse">
                      96% CUT
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-center text-slate-300 italic">
                    "月末の憂鬱だった事務作業が、<br />クリックひとつで終わるようになりました"
                  </p>
                </div>
              </div>

              {/* 中間CTA */}
              <div className="mt-8 text-center">
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-full font-bold text-lg shadow-xl shadow-sky-500/30 hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <Send size={20} />
                  無料デモを申し込む
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ターゲットオーディエンス */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">こんなお悩みありませんか？</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-sky-400 to-indigo-500 mx-auto rounded-full"></div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: "ドライバー管理が煩雑",
                text: "人数が増えるにつれ、誰がどれだけ稼働したかの把握が難しくなってきた。"
              },
              {
                icon: Calculator,
                title: "Excel管理の限界",
                text: "スプレッドシートが重い、数式が壊れる、スマホで見づらいなどの問題がある。"
              },
              {
                icon: Clock,
                title: "経理の時間がない",
                text: "現場に出ながらの事務作業は限界。もっと効率的な方法を探している。"
              }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card p-8 rounded-2xl h-full hover:-translate-y-2 transition-transform duration-300 group">
                  <div className="h-14 w-14 bg-sky-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors duration-300">
                    <item.icon className="text-sky-600 group-hover:text-white transition-colors duration-300" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className="py-24 relative overflow-hidden">
        {/* 視認性向上のための背景 */}
        <div className="absolute inset-0 bg-white/60 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <span className="text-sky-600 font-bold tracking-wider text-sm uppercase">Features</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-6 drop-shadow-sm">
                  必要な機能を、<br />シンプルに使いやすく。
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed glass-panel p-4 rounded-xl border-none bg-white/50">
                  多機能すぎて使いこなせないシステムは意味がありません。
                  運送委託業務に特化し、本当に必要な機能だけを厳選して搭載しました。
                </p>
                <div className="space-y-4">
                  {[
                    "個数入力のみで委託料を自動計算",
                    "ワンクリックで振込明細PDFを作成",
                    "ドライバーごとの単価設定を記憶",
                    "スマホ・PC完全対応"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4">
              <ScrollReveal delay={200}>
                <div className="glass-card p-6 rounded-2xl h-48 flex flex-col justify-end hover:bg-sky-50/50 transition-colors cursor-default border-white/60">
                  <Calculator className="h-8 w-8 text-sky-500 mb-4" />
                  <span className="font-bold text-slate-800">自動計算</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="glass-card p-6 rounded-2xl h-48 flex flex-col justify-end hover:bg-indigo-50/50 transition-colors cursor-default mt-8 border-white/60">
                  <FileText className="h-8 w-8 text-indigo-500 mb-4" />
                  <span className="font-bold text-slate-800">PDF出力</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <div className="glass-card p-6 rounded-2xl h-48 flex flex-col justify-end hover:bg-yellow-50/50 transition-colors cursor-default -mt-8 border-white/60">
                  <Zap className="h-8 w-8 text-yellow-500 mb-4" />
                  <span className="font-bold text-slate-800">日報機能</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={500}>
                <div className="glass-card p-6 rounded-2xl h-48 flex flex-col justify-end hover:bg-green-50/50 transition-colors cursor-default border-white/60">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-4" />
                  <span className="font-bold text-slate-800">ミス防止</span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 開発背景セクション（信頼強化） */}
      <section className="py-20 relative bg-slate-50/50 border-t border-slate-200/50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
              <Users size={24} className="text-slate-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              開発背景
            </h2>
            <div className="prose prose-lg mx-auto text-slate-600 leading-relaxed bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-lg">
              <p className="mb-6">
                報個くんは、実際に軽貨物業務を行う現場から生まれました。
              </p>
              <p className="mb-6">
                自社で週4時間かかっていた経理業務を改善するために開発され、<br className="hidden sm:block" />
                実運用を経てリリースしています。
              </p>
              <p className="font-bold text-slate-800 text-xl">
                机上の理論ではなく、現場で本当に使える仕組みです。
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 価格セクション */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="relative glass-panel rounded-[3rem] shadow-2xl overflow-hidden border-white/50">
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-sky-400 to-indigo-500"></div>

                <div className="p-8 sm:p-16 text-center">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-red-50/80 backdrop-blur-sm text-red-600 font-bold text-sm mb-6 border border-red-200 animate-pulse">
                    <Zap size={14} className="fill-red-500" />
                    残り枠わずか
                  </span>

                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 drop-shadow-sm">
                    🚀 先着5社様限定・買い切り導入
                  </h2>
                  <div className="text-slate-600 mb-6 max-w-lg mx-auto space-y-3">
                    <p>正式リリース後は<span className="font-bold text-slate-800">月額制（予定価格 月3,000円〜）</span>に移行予定です。</p>
                    <p>現在は<span className="font-bold text-sky-600">テスト導入期間</span>のため、特別価格でご提供中。</p>
                  </div>

                  <div className="mb-8">
                    <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm border border-green-100 shadow-sm">
                      <span className="font-bold">🔰 初期設定サポート付き</span>｜専門知識やITスキルは不要です
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-slate-500 font-bold text-lg">通常価格</span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        66% OFF
                      </span>
                    </div>
                    <div className="flex items-end gap-3 flex-wrap justify-center">
                      <span className="text-4xl font-bold text-slate-400 line-through decoration-slate-400/50 decoration-2 mb-2">
                        ¥30,000
                      </span>
                      <ArrowRight className="text-slate-300 mb-4 hidden sm:block" />
                      <div className="flex items-end gap-2">
                        <span className="text-6xl md:text-7xl font-extrabold text-red-500 tracking-tight drop-shadow-sm">¥10,000</span>
                        <span className="text-slate-500 text-xl font-medium pb-2">買い切り（税込）</span>
                      </div>
                    </div>
                  </div>

                  {/* 損失比較 */}
                  <div className="mb-10 bg-red-50 p-6 rounded-2xl border border-red-100 text-left max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="text-red-500" size={20} />
                      <p className="font-bold text-red-600">コスト比較</p>
                    </div>
                    <p className="text-slate-700 mb-2 font-medium">月16時間 × 時給1,500円 ＝</p>
                    <p className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-red-500">月24,000円</span>の損失
                    </p>
                    <div className="h-px bg-red-200 my-3"></div>
                    <p className="text-slate-800 font-bold text-center">
                      1万円で、その損失を今すぐ止められます。
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-12 text-left bg-white/40 p-6 rounded-2xl border border-white/50">
                    {[
                      "月額費用なし",
                      "将来アップデートも無料",
                      "全機能の無制限利用",
                      "導入サポート付き"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                          <CheckCircle2 size={12} className="text-green-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={twitterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-10 py-5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-full font-bold text-xl shadow-xl shadow-sky-500/30 hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                      <Send size={24} />
                      無料デモを申し込む
                    </a>
                  </div>
                  <p className="mt-6 text-sm text-slate-500 font-medium max-w-lg mx-auto">
                    ※残り枠が埋まり次第、販売終了します。
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 危機感コピー */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto mt-12 text-center">
              <div className="glass-panel rounded-2xl p-8 border-orange-200/50 bg-orange-50/30">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="text-orange-500" size={28} />
                </div>
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  手計算やExcel管理を続ける限り、<br />
                  <span className="font-bold text-slate-900">計算ミスや時間ロスは毎月発生し続けます。</span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-900/95 text-slate-400 py-16 backdrop-blur-md relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                  <FileText className="h-6 w-6 text-sky-500" />
                </div>
                <span className="font-bold text-2xl text-white tracking-tight">報個くん</span>
              </div>
              <p className="leading-relaxed max-w-sm">
                配送委託ドライバーの管理を、もっとシンプルに。<br />
                経理コストを削減し、事業の成長をサポートします。
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Menu</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-sky-400 transition-colors">機能</button></li>
                <li><button onClick={() => scrollToSection('flexibility')} className="hover:text-sky-400 transition-colors">対応業務</button></li>
                <li><button onClick={() => scrollToSection('impact')} className="hover:text-sky-400 transition-colors">導入効果</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-sky-400 transition-colors">価格</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <a
                href={twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-sky-400 transition-colors"
              >
                <Send size={16} />
                Twitter DM
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} 報個くん All rights reserved.
            </p>
            <p className="text-sm flex items-center gap-2">
              Made with <span className="text-red-500">♥</span> for Drivers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
