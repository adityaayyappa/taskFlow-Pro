import React, { useState, useEffect } from 'react';
import { Plus, X, MoreHorizontal, Star, Zap, Menu, Bell, User, Share2, Calendar, Search, Filter, Clock, Target, CheckCircle, Circle, Trash2, Edit3, Save, ArrowRight, ChevronDown, Flame, Sparkles, Download, Copy, Link, Mail, MessageCircle, Github, Linkedin, Twitter, Play, Award, Users, Rocket, Heart } from 'lucide-react';

const TaskFlowPro = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'app'
  const [lists, setLists] = useState([
    {
      id: 'urgent',
      title: 'Urgent Tasks',
      color: 'from-red-500 to-pink-600',
      cards: [
        { id: '1', title: 'Complete project proposal', priority: 'high', completed: false, timeSpent: 120, dueDate: '2024-08-05' },
        { id: '2', title: 'Review design mockups', priority: 'medium', completed: false, timeSpent: 45, dueDate: '2024-08-04' }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: 'from-blue-500 to-cyan-600',
      cards: [
        { id: '3', title: 'Develop new features', priority: 'high', completed: false, timeSpent: 300, dueDate: '2024-08-10' },
        { id: '4', title: 'Update documentation', priority: 'low', completed: false, timeSpent: 90, dueDate: '2024-08-08' }
      ]
    },
    {
      id: 'review',
      title: 'Under Review',
      color: 'from-yellow-500 to-orange-600',
      cards: [
        { id: '5', title: 'Code review session', priority: 'medium', completed: false, timeSpent: 60, dueDate: '2024-08-06' }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'from-green-500 to-emerald-600',
      cards: [
        { id: '6', title: 'Setup development environment', priority: 'high', completed: true, timeSpent: 180, dueDate: '2024-08-01' }
      ]
    }
  ]);

  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newCardTitles, setNewCardTitles] = useState({});
  const [addingCardToList, setAddingCardToList] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editingCardTitle, setEditingCardTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [timerActive, setTimerActive] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalTimeSpent: 0,
    productivity: 0
  });

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!timerActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Calculate stats
  useEffect(() => {
    const allCards = lists.flatMap(list => list.cards);
    const completed = allCards.filter(card => card.completed).length;
    const totalTime = allCards.reduce((sum, card) => sum + (card.timeSpent || 0), 0);
    const productivity = allCards.length > 0 ? Math.round((completed / allCards.length) * 100) : 0;
    
    setStats({
      totalTasks: allCards.length,
      completedTasks: completed,
      totalTimeSpent: totalTime,
      productivity
    });
  }, [lists]);

  const addList = () => {
    if (newListTitle.trim()) {
      const colors = [
        'from-purple-500 to-indigo-600',
        'from-pink-500 to-rose-600',
        'from-teal-500 to-cyan-600',
        'from-amber-500 to-orange-600'
      ];
      const newList = {
        id: Date.now().toString(),
        title: newListTitle,
        color: colors[Math.floor(Math.random() * colors.length)],
        cards: []
      };
      setLists([...lists, newList]);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const addCard = (listId) => {
    const cardTitle = newCardTitles[listId];
    if (cardTitle && cardTitle.trim()) {
      const newCard = {
        id: Date.now().toString(),
        title: cardTitle,
        priority: 'medium',
        completed: false,
        timeSpent: 0,
        dueDate: ''
      };
      setLists(lists.map(list => 
        list.id === listId 
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      ));
      setNewCardTitles({ ...newCardTitles, [listId]: '' });
      setAddingCardToList(null);
    }
  };

  const removeCard = (listId, cardId) => {
    setLists(lists.map(list => 
      list.id === listId 
        ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
        : list
    ));
  };

  const toggleCardComplete = (listId, cardId) => {
    setLists(lists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            cards: list.cards.map(card => 
              card.id === cardId 
                ? { ...card, completed: !card.completed }
                : card
            )
          }
        : list
    ));
  };

  const updateCardPriority = (listId, cardId, priority) => {
    setLists(lists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            cards: list.cards.map(card => 
              card.id === cardId 
                ? { ...card, priority }
                : card
            )
          }
        : list
    ));
  };

  const startTimer = (cardId) => {
    setTimerActive(cardId);
    setTimerSeconds(0);
  };

  const stopTimer = (listId, cardId) => {
    if (timerActive === cardId) {
      setLists(lists.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              cards: list.cards.map(card => 
                card.id === cardId 
                  ? { ...card, timeSpent: (card.timeSpent || 0) + timerSeconds }
                  : card
              )
            }
          : list
      ));
      setTimerActive(null);
      setTimerSeconds(0);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return '';
    }
  };

  const shareData = () => {
    const data = {
      lists: lists,
      stats: stats,
      timestamp: new Date().toISOString()
    };
    return btoa(JSON.stringify(data));
  };

  const copyShareLink = () => {
    const encodedData = shareData();
    const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const exportData = () => {
    const data = {
      lists: lists,
      stats: stats,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskflow-backup.json';
    link.click();
  };

  const filteredLists = lists.map(list => ({
    ...list,
    cards: list.cards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || card.priority === filterPriority;
      return matchesSearch && matchesPriority;
    })
  }));

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-black/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
            TF
          </div>
          <span className="text-2xl font-bold tracking-tight">TaskFlow Pro</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <button 
            onClick={() => setCurrentView('app')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
            TaskFlow Pro
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed">
            The ultimate productivity companion that transforms chaos into clarity. 
            Organize, track, and accomplish your goals with unprecedented efficiency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button 
              onClick={() => setCurrentView('app')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Launch TaskFlow</span>
            </button>
            <button className="border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">99%</div>
              <div className="text-sm text-gray-400">Productivity Boost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-300">10K+</div>
              <div className="text-sm text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">24/7</div>
              <div className="text-sm text-gray-400">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">∞</div>
              <div className="text-sm text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 px-6 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-4">Lightning Speed</h3>
              <p className="text-gray-300">Experience blazing fast performance with real-time updates and instant synchronization.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <Target className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold mb-4">Smart Tracking</h3>
              <p className="text-gray-300">Advanced time tracking and productivity analytics to help you understand your work patterns.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <Share2 className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-4">Easy Sharing</h3>
              <p className="text-gray-300">Share your boards instantly with team members or export your data for backup.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">About TaskFlow Pro</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-12">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Built with Passion</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              TaskFlow Pro is crafted by a passionate developer who understands the challenges of modern productivity. 
              This isn't just another task manager – it's a comprehensive productivity ecosystem designed to adapt to your unique workflow.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/5 rounded-xl p-6">
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="font-semibold">Excellence Driven</div>
                <div className="text-gray-400 mt-2">Committed to delivering the best user experience</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="font-semibold">Community Focused</div>
                <div className="text-gray-400 mt-2">Built with user feedback and continuous improvement</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <Rocket className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="font-semibold">Innovation First</div>
                <div className="text-gray-400 mt-2">Always pushing the boundaries of what's possible</div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center justify-center space-x-6">
            <a href="https://github.com" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="mailto:hello@taskflowpro.com" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-400" />
          <span>by TaskFlow Pro Team</span>
        </div>
      </footer>
    </div>
  );

  // Main App Component
  const TaskBoardApp = () => (
    <div className={`min-h-screen transition-all duration-500 ${bgClass} ${textClass}`}>
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${cardBgClass} rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Your Board</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={copyShareLink}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Link className="w-4 h-4" />
                <span>Copy Share Link</span>
              </button>
              
              <button
                onClick={exportData}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              
              <div className="text-sm text-gray-500 mt-4">
                Share links contain your current board state and can be opened by anyone with the link.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border-b ${borderClass} px-6 py-4 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('landing')}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-110 shadow-lg text-white"
              >
                TF
              </button>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">TaskFlow Pro</h1>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${cardBgClass} ${textClass} border ${borderClass} pl-10 pr-4 py-2 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`${cardBgClass} ${textClass} border ${borderClass} px-3 py-2 rounded-xl focus:outline-none transition-all duration-200 shadow-lg`}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Stats Display */}
            <div className="flex items-center space-x-6 text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 px-4 py-2 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">{stats.totalTasks} Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{stats.completedTasks} Done</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{Math.floor(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}m</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{stats.productivity}% Done</span>
              </div>
            </div>

            {/* Control Buttons */}
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg ${darkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${focusMode ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'}`}
            >
              {focusMode ? 'Exit Focus' : 'Focus Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Timer Display */}
      {timerActive && (
        <div className={`bg-gradient-to-r from-green-500 to-emerald-600 border-b ${borderClass} px-6 py-3 text-center shadow-lg`}>
          <div className="flex items-center justify-center space-x-4 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-lg font-mono font-bold">Timer Active: {formatTime(timerSeconds)}</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      )}

      {/* Board Content */}
      <div className="p-6">
        <div className={`flex space-x-6 overflow-x-auto ${focusMode ? 'blur-sm hover:blur-none transition-all duration-300' : ''}`}>
          {filteredLists.map((list, index) => (
            <div 
              key={list.id} 
              className={`${cardBgClass} rounded-2xl p-6 min-w-80 max-w-80 flex-shrink-0 border ${borderClass} transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 shadow-xl`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 bg-gradient-to-r ${list.color} rounded-full shadow-lg`}></div>
                  <h3 className="font-bold text-lg">{list.title}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} font-semibold shadow-sm`}>
                    {list.cards.length}
                  </span>
                </div>
                <MoreHorizontal className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-200 text-gray-500" />
              </div>

              {/* Cards */}
              <div className="space-y-4 mb-6">
                {list.cards.map((card, cardIndex) => (
                  <div 
                    key={card.id} 
                    className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-4 border ${borderClass} transition-all duration-300 hover:shadow-xl transform hover:scale-102 ${getPriorityColor(card.priority)} ${card.completed ? 'opacity-70' : ''} shadow-lg`}
                    style={{
                      animationDelay: `${(index * 100) + (cardIndex * 50)}ms`,
                      animation: 'fadeInScale 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() => toggleCardComplete(list.id, card.id)}
                          className="mt-1 transition-transform duration-200 hover:scale-110"
                        >
                          {card.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        
                        {editingCard === card.id ? (
                          <input
                            type="text"
                            value={editingCardTitle}
                            onChange={(e) => setEditingCardTitle(e.target.value)}
                            onBlur={() => {
                              if (editingCardTitle.trim()) {
                                setLists(lists.map(l => 
                                  l.id === list.id 
                                    ? { 
                                        ...l, 
                                        cards: l.cards.map(c => 
                                          c.id === card.id 
                                            ? { ...c, title: editingCardTitle }
                                            : c
                                        )
                                      }
                                    : l
                                ));
                              }
                              setEditingCard(null);
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur();
                              }
                            }}
                            className={`${cardBgClass} ${textClass} border ${borderClass} px-2 py-1 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm`}
                            autoFocus
                          />
                        ) : (
                          <span 
                            className={`flex-1 ${card.completed ? 'line-through' : ''} cursor-pointer hover:text-purple-600 transition-colors duration-200 font-medium`}
                            onClick={() => {
                              setEditingCard(card.id);
                              setEditingCardTitle(card.title);
                            }}
                          >
                            {card.title}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeCard(list.id, card.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Details */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <select
                        value={card.priority}
                        onChange={(e) => updateCardPriority(list.id, card.id, e.target.value)}
                        className={`${cardBgClass} border ${borderClass} px-2 py-1 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm`}
                      >
                        <option value="high">🔴 High Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="low">🟢 Low Priority</option>
                      </select>
                      
                      {card.timeSpent > 0 && (
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-semibold">
                          {Math.floor(card.timeSpent / 60)}h {card.timeSpent % 60}m
                        </span>
                      )}
                    </div>

                    {/* Timer Controls */}
                    <div className="flex items-center space-x-2 mt-3">
                      {timerActive === card.id ? (
                        <button
                          onClick={() => stopTimer(list.id, card.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                        >
                          <span>Stop</span>
                          <span className="font-mono">{formatTime(timerSeconds)}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => startTimer(card.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Start Timer</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Card */}
              {addingCardToList === list.id ? (
                <div className="space-y-3">
                  <textarea
                    value={newCardTitles[list.id] || ''}
                    onChange={(e) => setNewCardTitles({ ...newCardTitles, [list.id]: e.target.value })}
                    placeholder="Enter task description..."
                    className={`w-full p-3 ${cardBgClass} ${textClass} border ${borderClass} rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg`}
                    rows="3"
                    autoFocus
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => addCard(list.id)}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => setAddingCardToList(null)}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingCardToList(list.id)}
                  className={`w-full p-4 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'} border-2 border-dashed rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 text-gray-500 hover:text-purple-600 shadow-lg`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Add new task</span>
                </button>
              )}
            </div>
          ))}

          {/* Add List */}
          {isAddingList ? (
            <div className={`${cardBgClass} rounded-2xl p-6 min-w-80 max-w-80 flex-shrink-0 border ${borderClass} shadow-xl`}>
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                className={`w-full p-3 ${darkMode ? 'bg-gray-900' : 'bg-white'} ${textClass} border ${borderClass} rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg`}
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={addList}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Add List
                </button>
                <button
                  onClick={() => setIsAddingList(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-600' : 'bg-white hover:bg-gray-50 border-gray-300'} border-2 border-dashed rounded-2xl p-6 min-w-80 max-w-80 flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 text-gray-500 hover:text-purple-600 shadow-xl`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add another list</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );

  // Main render logic
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  return <TaskBoardApp />;
};

export default TaskFlowPro;