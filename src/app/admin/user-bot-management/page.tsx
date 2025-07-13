'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Bot, 
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  MoreVertical,
  Activity,
  User,
  Cpu,
  Mail,
  Building,
  Award,
  Shield,
  Edit,
  X
} from 'lucide-react';
import { collection, query, where, onSnapshot, Timestamp, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';

// Type definitions for Firestore data
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isActive: boolean;
  organization: string;
  ecoPoints: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by_admin: string;
}

interface BotData {
  id: string;
  bot_id: string;
  name: string;
  organization: string;
  assigned_to?: string;
  assigned_at?: Timestamp;
  owner_admin_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  notes: string;
}

interface BotRegistry {
  id: string;
  bot_id: string;
  is_registered: boolean;
  created_at: Timestamp;
}

export default function UserBotManagement() {
  const [activeView, setActiveView] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | BotData | null>(null);
  const [currentUser] = useAuthState(auth);
  
  // Bot registration states
  const [botRegistrationStep, setBotRegistrationStep] = useState(1);
  const [validatedBotId, setValidatedBotId] = useState('');
  const [botValidationStatus, setBotValidationStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'registered'>('idle');

  // Bot management states
  const [manageTab, setManageTab] = useState('assign');
  const [pendingAssignment, setPendingAssignment] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch users created by current admin
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('created_by_admin', '==', currentUser.uid)
        );
        
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
          const usersData: User[] = [];
          snapshot.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() } as User);
          });
          setUsers(usersData);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Fetch bots owned by current admin
  useEffect(() => {
    if (!currentUser) return;

    const fetchBots = async () => {
      try {
        const botsQuery = query(
          collection(db, 'bots'),
          where('owner_admin_id', '==', currentUser.uid)
        );
        
        const unsubscribe = onSnapshot(botsQuery, (snapshot) => {
          const botsData: BotData[] = [];
          snapshot.forEach((doc) => {
            botsData.push({ id: doc.id, ...doc.data() } as BotData);
          });
          setBots(botsData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching bots:', error);
        setLoading(false);
      }
    };

    fetchBots();
  }, [currentUser]);

  // Helper function to get user status
  const getUserStatus = (user: User) => {
    return user.isActive ? 'Active' : 'Offline';
  };

  // Helper function to get bot status (simulate based on data)
  const getBotStatus = (bot: BotData) => {
    if (bot.assigned_to) {
      return 'Active';
    }
    return 'Available';
  };

  // Helper function to get user's assigned bots
  const getUserAssignedBots = (userId: string) => {
    return bots.filter(bot => bot.assigned_to === userId);
  };

  // Helper function to find assigned user for bot
  const getBotAssignedUser = (bot: BotData) => {
    if (!bot.assigned_to) return 'Unassigned';
    const user = users.find(u => u.id === bot.assigned_to);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown User';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'offline': return 'text-red-600 bg-red-50';
      case 'available': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'offline': return <AlertCircle className="h-3 w-3" />;
      case 'available': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  // Validate bot ID against registry
  const validateBotId = async (botId: string) => {
    setBotValidationStatus('checking');
    
    try {
      const registryQuery = query(
        collection(db, 'bot_registry'),
        where('bot_id', '==', botId)
      );
      
      const registrySnapshot = await getDocs(registryQuery);
      
      if (registrySnapshot.empty) {
        setBotValidationStatus('invalid');
        return;
      }
      
      const botRegistry = registrySnapshot.docs[0].data() as BotRegistry;
      
      if (botRegistry.is_registered) {
        setBotValidationStatus('registered');
        return;
      }
      
      setBotValidationStatus('valid');
      setValidatedBotId(botId);
    } catch (error) {
      console.error('Error validating bot ID:', error);
      setBotValidationStatus('invalid');
    }
  };

  // Add new operator (auto-set role to field_operator)
  const handleAddOperator = async (operatorData: Partial<User>) => {
    if (!currentUser) return;
    
    try {
      await addDoc(collection(db, 'users'), {
        ...operatorData,
        role: 'field_operator', // Auto-set role
        created_by_admin: currentUser.uid,
        created_at: new Date(),
        updated_at: new Date(),
        isActive: true,
        ecoPoints: 0,
        badges: []
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding operator:', error);
    }
  };

  // Add new bot with registry validation
  const handleAddBot = async (botData: Partial<BotData>) => {
    if (!currentUser || !validatedBotId) return;
    
    try {
      // Add bot to bots collection
      await addDoc(collection(db, 'bots'), {
        ...botData,
        bot_id: validatedBotId,
        owner_admin_id: currentUser.uid,
        created_at: new Date(),
        updated_at: new Date(),
        notes: botData.notes || ''
      });

      // Update registry to mark as registered
      const registryQuery = query(
        collection(db, 'bot_registry'),
        where('bot_id', '==', validatedBotId)
      );
      const registrySnapshot = await getDocs(registryQuery);
      
      if (!registrySnapshot.empty) {
        const registryDoc = registrySnapshot.docs[0];
        await updateDoc(doc(db, 'bot_registry', registryDoc.id), {
          is_registered: true,
          registered_at: new Date()
        });
      }

      // Reset states
      setShowAddModal(false);
      setBotRegistrationStep(1);
      setValidatedBotId('');
      setBotValidationStatus('idle');
    } catch (error) {
      console.error('Error adding bot:', error);
    }
  };

  // Update item
  const handleUpdateItem = async (updates: Partial<User | BotData>) => {
    if (!selectedItem) return;
    
    try {
      await updateDoc(doc(db, activeView === 'users' ? 'users' : 'bots', selectedItem.id), {
        ...updates,
        updated_at: new Date()
      });
      setShowManageModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Assign bot to operator
  const handleAssignBot = async (botId: string, operatorId: string | null) => {
    try {
      await updateDoc(doc(db, 'bots', botId), {
        assigned_to: operatorId,
        assigned_at: operatorId ? new Date() : null,
        updated_at: new Date()
      });
      setPendingAssignment(null);
      setHasChanges(false);
      setShowManageModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error assigning bot:', error);
    }
  };

  // Unregister bot
  const handleUnregisterBot = async (botId: string, bot_id: string) => {
    try {
      // Remove bot from bots collection
      await updateDoc(doc(db, 'bots', botId), {
        deleted: true,
        deleted_at: new Date(),
        updated_at: new Date()
      });

      // Update registry to mark as unregistered
      const registryQuery = query(
        collection(db, 'bot_registry'),
        where('bot_id', '==', bot_id)
      );
      const registrySnapshot = await getDocs(registryQuery);
      
      if (!registrySnapshot.empty) {
        const registryDoc = registrySnapshot.docs[0];
        await updateDoc(doc(db, 'bot_registry', registryDoc.id), {
          is_registered: false,
          unregistered_at: new Date()
        });
      }

      setShowManageModal(false);
      setSelectedItem(null);
      setManageTab('assign');
    } catch (error) {
      console.error('Error unregistering bot:', error);
    }
  };

  // Handle assignment change
  const handleAssignmentChange = (operatorId: string) => {
    setPendingAssignment(operatorId || null);
    const currentAssignment = (selectedItem as BotData)?.assigned_to;
    setHasChanges(operatorId !== currentAssignment);
  };

  // Get pending assignment user
  const getPendingAssignmentUser = () => {
    if (!pendingAssignment) return 'Unassigned';
    const user = users.find(u => u.id === pendingAssignment);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown User';
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'field_operator': return <User className="h-4 w-4 text-blue-600" />;
      case 'supervisor': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'admin': return <Settings className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-blue-600" />;
    }
  };

  // Get bot type icon
  const getBotTypeIcon = () => {
    return <Cpu className="h-4 w-4 text-green-600" />;
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const userStatus = getUserStatus(user);
    const matchesStatus = statusFilter === 'all' || userStatus.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.bot_id.toLowerCase().includes(searchTerm.toLowerCase());
    const botStatus = getBotStatus(bot);
    const matchesStatus = statusFilter === 'all' || botStatus.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter(u => u.isActive).length;
  const activeBots = bots.filter(b => getBotStatus(b) === 'Active').length;
  const totalUsers = users.length;
  const totalBots = bots.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Team & Fleet Management</h1>
              <p className="text-gray-600 text-sm">Manage field operators and autonomous systems</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {activeView === 'users' ? 'Operator' : 'Bot'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Operators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeUsers}</p>
                <p className="text-xs text-gray-500 mt-1">{totalUsers} total</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bots</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeBots}</p>
                <p className="text-xs text-gray-500 mt-1">{totalBots} deployed</p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignment Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalBots > 0 ? Math.round((activeBots / totalBots) * 100) : 0}%</p>
                <p className="text-xs text-gray-500 mt-1">Bots deployed</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* View Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-3">View</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveView('users')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === 'users'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Operators</span>
                </button>
                <button
                  onClick={() => setActiveView('bots')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === 'bots'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">Bots</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-3">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeView}...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="offline">Offline</option>
                {activeView === 'bots' && <option value="available">Available</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeView === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const assignedBots = getUserAssignedBots(user.id);
              const userStatus = getUserStatus(user);
              
              return (
                <div key={user.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    {/* Header with icon and status */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 truncate">{user.firstname} {user.lastname}</h4>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(userStatus)}`}>
                            {getStatusIcon(userStatus)}
                            {userStatus}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate capitalize">{user.role.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{user.organization || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bot className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{assignedBots.length} Bot{assignedBots.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{user.ecoPoints} Points</span>
                      </div>
                    </div>

                    {/* Assigned Bots - Always show this section for uniform height */}
                    <div className="mb-4 min-h-[2rem]">
                      {assignedBots.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedBots.slice(0, 2).map((bot) => (
                            <span key={bot.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                              <Cpu className="h-3 w-3 mr-1" />
                              {bot.bot_id}
                            </span>
                          ))}
                          {assignedBots.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                              +{assignedBots.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Bot className="h-3 w-3" />
                          <span>No bots assigned</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedItem(user);
                          setShowManageModal(true);
                        }}
                        className="flex-1 bg-blue-500 text-white rounded-xl py-2 px-3 text-sm font-medium hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Manage
                      </button>
                      <button className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView === 'bots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBots.map((bot) => {
              const botStatus = getBotStatus(bot);
              const assignedUser = getBotAssignedUser(bot);
              
              return (
                <div key={bot.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    {/* Header with proper hierarchy */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                        {getBotTypeIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 truncate">{bot.name}</h4>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(botStatus)}`}>
                            {getStatusIcon(botStatus)}
                            {botStatus}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <span className="truncate">{bot.bot_id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{assignedUser}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{bot.organization || 'No organization'}</span>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="mb-4 min-h-[2rem] flex items-center">
                      <div className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: botStatus === 'Active' ? '#22c55e' : '#3b82f6' }}
                        ></div>
                        <span className="text-gray-600">
                          {bot.assigned_to ? 'Currently assigned' : 'Available for assignment'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedItem(bot);
                          setShowManageModal(true);
                        }}
                        className="flex-1 bg-blue-500 text-white rounded-xl py-2 px-3 text-sm font-medium hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New {activeView === 'users' ? 'Operator' : 'Bot'}
                  {activeView === 'bots' && ` - Step ${botRegistrationStep} of 2`}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setBotRegistrationStep(1);
                    setValidatedBotId('');
                    setBotValidationStatus('idle');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {activeView === 'users' ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  handleAddOperator(data);
                }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="firstname" placeholder="First Name" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input name="lastname" placeholder="Last Name" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <input name="email" type="email" placeholder="Email" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    <input name="organization" placeholder="Organization (Optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="flex-1 bg-blue-500 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-600 transition-colors">
                      Add Operator
                    </button>
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {botRegistrationStep === 1 ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bot ID</label>
                        <input 
                          type="text" 
                          placeholder="Enter Bot ID (e.g., AGOS-001)" 
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              validateBotId(e.target.value.trim());
                            }
                          }}
                        />
                        
                        {botValidationStatus === 'checking' && (
                          <div className="mt-2 flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent"></div>
                            <span className="text-xs">Validating bot ID...</span>
                          </div>
                        )}
                        
                        {botValidationStatus === 'invalid' && (
                          <div className="mt-2 text-xs text-red-600">
                            Bot ID not found in registry. Please check the ID and try again.
                          </div>
                        )}
                        
                        {botValidationStatus === 'registered' && (
                          <div className="mt-2 text-xs text-orange-600">
                            This bot is already registered and cannot be added again.
                          </div>
                        )}
                        
                        {botValidationStatus === 'valid' && (
                          <div className="mt-2 text-xs text-green-600">
                            ✓ Bot ID is valid and available for registration.
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setBotRegistrationStep(2)}
                          disabled={botValidationStatus !== 'valid'}
                          className="flex-1 bg-blue-500 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowAddModal(false)}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData.entries());
                      handleAddBot(data);
                    }}>
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="text-sm text-green-800">
                            <strong>Bot ID:</strong> {validatedBotId}
                          </div>
                        </div>
                        
                        <input name="name" placeholder="Bot Name" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <input name="organization" placeholder="Organization (Optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <textarea name="notes" placeholder="Notes (Optional)" rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"></textarea>
                      </div>
                      
                      <div className="flex gap-3 mt-6">
                        <button type="submit" className="flex-1 bg-blue-500 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-600 transition-colors">
                          Register Bot
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setBotRegistrationStep(1)}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Modal */}
      {showManageModal && selectedItem && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage {activeView === 'users' ? (selectedItem as User).firstname + ' ' + (selectedItem as User).lastname : (selectedItem as BotData).name}
                </h3>
                <button 
                  onClick={() => {
                    setShowManageModal(false);
                    setPendingAssignment(null);
                    setHasChanges(false);
                    setManageTab('assign');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {activeView === 'users' ? (
                <>
                  <button 
                    onClick={() => handleUpdateItem({ isActive: !(selectedItem as User).isActive })}
                    className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                      (selectedItem as User).isActive 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {(selectedItem as User).isActive ? 'Deactivate User' : 'Activate User'}
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setManageTab('assign')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        manageTab === 'assign'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Assignment
                    </button>
                    <button
                      onClick={() => setManageTab('unregister')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        manageTab === 'unregister'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Unregister
                    </button>
                  </div>

                  {manageTab === 'assign' ? (
                    <>
                      {/* Current Assignment Section */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Assignment</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getBotAssignedUser(selectedItem as BotData)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedItem as BotData).assigned_to ? 'Currently assigned' : 'No operator assigned'}
                            </p>
                          </div>
                        </div>
                        
                        {(selectedItem as BotData).assigned_to && (
                          <button 
                            onClick={() => handleAssignmentChange('')}
                            className="mt-3 w-full bg-gray-500 text-white rounded-lg py-2 px-3 text-sm font-medium hover:bg-gray-600 transition-colors"
                          >
                            Remove Current Assignment
                          </button>
                        )}
                      </div>

                      {/* Assignment Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Operator</label>
                        <select 
                          value={pendingAssignment || (selectedItem as BotData).assigned_to || ''}
                          onChange={(e) => handleAssignmentChange(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Operator</option>
                          {users.filter(u => u.isActive).map(user => (
                            <option key={user.id} value={user.id}>
                              {user.firstname} {user.lastname}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Changes Preview */}
                      {hasChanges && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">Preview Changes</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">From:</span>
                              <span className="font-medium text-gray-900">
                                {getBotAssignedUser(selectedItem as BotData)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">To:</span>
                              <span className="font-medium text-blue-800">
                                {getPendingAssignmentUser()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {hasChanges ? (
                          <button 
                            onClick={() => handleAssignBot(selectedItem.id, pendingAssignment)}
                            className="flex-1 bg-blue-500 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-600 transition-colors"
                          >
                            Save Changes
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setShowManageModal(false);
                              setPendingAssignment(null);
                              setHasChanges(false);
                              setManageTab('assign');
                            }}
                            className="flex-1 border border-gray-200 rounded-lg py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Close
                          </button>
                        )}
                        
                        {hasChanges && (
                          <button 
                            onClick={() => {
                              setPendingAssignment(null);
                              setHasChanges(false);
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Unregister Tab */
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-red-800 mb-1">Unregister Bot</h4>
                            <p className="text-sm text-red-700">
                              This will remove the bot from your fleet and make it available for registration by other admins.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Bot Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bot ID:</span>
                            <span className="font-medium">{(selectedItem as BotData).bot_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{(selectedItem as BotData).name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Assignment:</span>
                            <span className="font-medium">{getBotAssignedUser(selectedItem as BotData)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button 
                          onClick={() => handleUnregisterBot(selectedItem.id, (selectedItem as BotData).bot_id)}
                          className="w-full bg-red-500 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Confirm Unregister Bot
                        </button>
                        <button 
                          onClick={() => setManageTab('assign')}
                          className="w-full border border-gray-200 rounded-lg py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
