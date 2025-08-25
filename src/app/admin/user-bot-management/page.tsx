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
  Calendar,
  Shield,
  Edit,
  X
} from 'lucide-react';
import { collection, query, where, onSnapshot, Timestamp, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { 
  userManagementAlerts, 
  botManagementAlerts, 
  loadingAlerts, 
  closeAlert 
} from '@/utils/alerts';

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

  // Additional states for user management
  const [userManageTab, setUserManageTab] = useState('profile');
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const [hasUserChanges, setHasUserChanges] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

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

  // Initialize edit data when selectedItem changes
  useEffect(() => {
    if (selectedItem && activeView === 'users') {
      const user = selectedItem as User;
      setEditUserData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        organization: user.organization || '',
        role: user.role
      });
      setHasUserChanges(false);
      setIsEditingUser(false);
    }
  }, [selectedItem, activeView]);

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

  // Handle user profile field changes
  const handleUserFieldChange = (field: string, value: string) => {
    setEditUserData(prev => ({ ...prev, [field]: value }));
    
    // Check if there are changes
    if (selectedItem) {
      const user = selectedItem as User;
      const currentData = { ...editUserData, [field]: value };
      const hasChanges = 
        currentData.firstname !== user.firstname ||
        currentData.lastname !== user.lastname ||
        currentData.email !== user.email ||
        currentData.organization !== (user.organization || '') ||
        currentData.role !== user.role;
      
      setHasUserChanges(hasChanges);
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
      userManagementAlerts.userAdded();
    } catch (error) {
      console.error('Error adding operator:', error);
      userManagementAlerts.userAddFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Save user profile changes
  const handleSaveUserProfile = async () => {
    if (!selectedItem || !hasUserChanges) return;
    
    loadingAlerts.savingUser();
    
    try {
      await updateDoc(doc(db, 'users', selectedItem.id), {
        ...editUserData,
        updated_at: new Date()
      });
      setHasUserChanges(false);
      setIsEditingUser(false);
      // Refresh the selectedItem with new data
      const updatedUser = { ...selectedItem, ...editUserData } as User;
      setSelectedItem(updatedUser);
      
      closeAlert();
      userManagementAlerts.userUpdated();
    } catch (error) {
      console.error('Error updating user profile:', error);
      closeAlert();
      userManagementAlerts.userUpdateFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Update item
  const handleUpdateItem = async (updates: Partial<User | BotData>) => {
    if (!selectedItem) return;
    
    // If deactivating user, show confirmation
    if (activeView === 'users' && 'isActive' in updates && !updates.isActive) {
      const user = selectedItem as User;
      const result = await userManagementAlerts.confirmUserDeactivation(`${user.firstname} ${user.lastname}`);
      if (!result.isConfirmed) return;
    }
    
    try {
      await updateDoc(doc(db, activeView === 'users' ? 'users' : 'bots', selectedItem.id), {
        ...updates,
        updated_at: new Date()
      });
      setShowManageModal(false);
      setSelectedItem(null);
      
      // Show appropriate success message
      if (activeView === 'users' && 'isActive' in updates) {
        if (updates.isActive) {
          userManagementAlerts.userActivated();
        } else {
          userManagementAlerts.userDeactivated();
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
      userManagementAlerts.userStatusUpdateFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Assign bot to operator
  const handleAssignBot = async (botId: string, operatorId: string | null) => {
    loadingAlerts.assigningBot();
    
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
      
      closeAlert();
      
      if (operatorId) {
        const bot = selectedItem as BotData;
        const user = users.find(u => u.id === operatorId);
        if (user && bot) {
          botManagementAlerts.botAssigned(bot.bot_id, `${user.firstname} ${user.lastname}`);
        }
      }
    } catch (error) {
      console.error('Error assigning bot:', error);
      closeAlert();
      botManagementAlerts.botAssignmentFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Add new bot with alerts
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

      setShowAddModal(false);
      setBotRegistrationStep(1);
      setValidatedBotId('');
      setBotValidationStatus('idle');
      
      botManagementAlerts.botAdded(validatedBotId);
    } catch (error) {
      console.error('Error adding bot:', error);
      botManagementAlerts.botRegistrationFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Unregister bot
  const handleUnregisterBot = async (botId: string, bot_id: string) => {
    const bot = selectedItem as BotData;
    const result = await botManagementAlerts.confirmBotUnregistration(bot_id, bot.name);
    if (!result.isConfirmed) return;
    
    try {
      // Delete bot document completely
      await deleteDoc(doc(db, 'bots', botId));

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
      
      botManagementAlerts.botUnregistered(bot_id);
    } catch (error) {
      console.error('Error unregistering bot:', error);
      botManagementAlerts.botUnregistrationFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Unlink bot from user with confirmation
  const handleUnlinkBot = async (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;
    
    const result = await userManagementAlerts.confirmBotUnlink(bot.name);
    if (!result.isConfirmed) return;
    
    try {
      await updateDoc(doc(db, 'bots', botId), {
        assigned_to: null,
        assigned_at: null,
        updated_at: new Date()
      });
      
      userManagementAlerts.botUnlinked();
    } catch (error) {
      console.error('Error unlinking bot:', error);
      userManagementAlerts.botUnlinkFailed(error instanceof Error ? error.message : undefined);
    }
  };

  // Validate bot ID against registry
  const validateBotId = async (botId: string) => {
    setBotValidationStatus('checking');
    loadingAlerts.validatingBot();
    
    try {
      const registryQuery = query(
        collection(db, 'bot_registry'),
        where('bot_id', '==', botId)
      );
      
      const registrySnapshot = await getDocs(registryQuery);
      
      closeAlert();
      
      if (registrySnapshot.empty) {
        setBotValidationStatus('invalid');
        botManagementAlerts.botValidationFailed();
        return;
      }
      
      const botRegistry = registrySnapshot.docs[0].data() as BotRegistry;
      
      if (botRegistry.is_registered) {
        setBotValidationStatus('registered');
        botManagementAlerts.botAlreadyRegistered();
        return;
      }
      
      setBotValidationStatus('valid');
      setValidatedBotId(botId);
    } catch (error) {
      console.error('Error validating bot ID:', error);
      closeAlert();
      setBotValidationStatus('invalid');
      botManagementAlerts.botValidationFailed();
    }
  };

  // Cancel editing
  const handleCancelEditUser = () => {
    if (selectedItem) {
      const user = selectedItem as User;
      setEditUserData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        organization: user.organization || '',
        role: user.role
      });
      setHasUserChanges(false);
      setIsEditingUser(false);
    }
  };

  // Get pending assignment user
  const getPendingAssignmentUser = () => {
    if (!pendingAssignment) return 'Unassigned';
    const user = users.find(u => u.id === pendingAssignment);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown User';
  };

  // Handle assignment change
  const handleAssignmentChange = (operatorId: string) => {
    setPendingAssignment(operatorId || null);
    const currentAssignment = (selectedItem as BotData)?.assigned_to;
    setHasChanges(operatorId !== currentAssignment);
  };

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case 'active': return 'text-green-600 bg-green-50';
  //     case 'offline': return 'text-red-600 bg-red-50';
  //     case 'available': return 'text-blue-600 bg-blue-50';
  //     default: return 'text-gray-600 bg-gray-50';
  //   }
  // };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'offline': return <AlertCircle className="h-3 w-3" />;
      case 'available': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
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

  // Helper function to format last activity
  const getLastActivity = (user: User) => {
    if (!user.updated_at) return 'No activity';
    const lastActivity = user.updated_at.toDate();
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return lastActivity.toLocaleDateString();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
          <p className="text-slate-700 text-sm">Loading management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1">Team & Fleet Management</h1>
              <p className="text-slate-600 text-sm">Manage field operators and autonomous systems</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add {activeView === 'users' ? 'Operator' : 'Bot'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Operators</p>
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-0.5">{activeUsers}</p>
                <p className="text-xs text-slate-500">{totalUsers} total</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-emerald-50/80 backdrop-blur-sm rounded-xl border border-emerald-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Bots</p>
                <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mt-0.5">{activeBots}</p>
                <p className="text-xs text-slate-500">{totalBots} deployed</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl shadow-lg">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-sm rounded-xl border border-purple-200/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Assignment Rate</p>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mt-0.5">{totalBots > 0 ? Math.round((activeBots / totalBots) * 100) : 0}%</p>
                <p className="text-xs text-slate-500">Bots deployed</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50 p-4 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">View</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setActiveView('users')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeView === 'users'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 hover:from-slate-100 hover:to-slate-200 border border-slate-200/50 hover:shadow-md'
                  }`}
                >
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">Operators</span>
                </button>
                <button
                  onClick={() => setActiveView('bots')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeView === 'bots'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 hover:from-slate-100 hover:to-slate-200 border border-slate-200/50 hover:shadow-md'
                  }`}
                >
                  <Bot className="h-3 w-3" />
                  <span className="hidden sm:inline">Bots</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="lg:w-56">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeView}...`}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200/50 rounded-lg bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div className="lg:w-40">
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-slate-200/50 rounded-lg px-3 py-2 text-sm bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const assignedBots = getUserAssignedBots(user.id);
              const userStatus = getUserStatus(user);
              const lastActivity = getLastActivity(user);
              
              return (
                <div key={user.id} className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300/50">
                  <div className="p-4">
                    {/* Header with icon and status */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate text-sm">{user.firstname} {user.lastname}</h4>
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium shadow-sm ${
                            userStatus === 'Active' 
                              ? 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200/50' 
                              : 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50'
                          }`}>
                            {getStatusIcon(userStatus)}
                            {userStatus}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                          <Mail className="h-2.5 w-2.5" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30">
                        <User className="h-2.5 w-2.5 text-slate-500" />
                        <span className="text-slate-600 truncate capitalize">{user.role.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30">
                        <Building className="h-2.5 w-2.5 text-slate-500" />
                        <span className="text-slate-600 truncate">{user.organization || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30">
                        <Bot className="h-2.5 w-2.5 text-slate-500" />
                        <span className="text-slate-600">{assignedBots.length} Bot{assignedBots.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200/30">
                        <Calendar className="h-2.5 w-2.5 text-blue-600" />
                        <span className="text-blue-700 font-medium">{lastActivity}</span>
                      </div>
                    </div>

                    {/* Assigned Bots */}
                    <div className="mb-3 min-h-[1.5rem]">
                      {assignedBots.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedBots.slice(0, 2).map((bot) => (
                            <span key={bot.id} className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-md text-xs font-medium border border-blue-200/50 shadow-sm">
                              <Cpu className="h-2.5 w-2.5 mr-0.5" />
                              {bot.bot_id}
                            </span>
                          ))}
                          {assignedBots.length > 2 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-md text-xs border border-slate-200/50">
                              +{assignedBots.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30">
                          <Bot className="h-2.5 w-2.5" />
                          <span>No bots assigned</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => {
                          setSelectedItem(user);
                          setShowManageModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-1.5 px-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                      >
                        <Edit className="h-2.5 w-2.5" />
                        Manage
                      </button>
                      <button className="p-1.5 border border-slate-200/50 rounded-lg text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-200 shadow-sm hover:shadow-md">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView === 'bots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBots.map((bot) => {
              const botStatus = getBotStatus(bot);
              const assignedUser = getBotAssignedUser(bot);
              
              return (
                <div key={bot.id} className="bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm rounded-xl border border-emerald-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-300/50">
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md">
                        {getBotTypeIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate text-sm">{bot.name}</h4>
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium shadow-sm ${
                            botStatus === 'Active' 
                              ? 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200/50' 
                              : 'text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200/50'
                          }`}>
                            {getStatusIcon(botStatus)}
                            {botStatus}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <span className="truncate font-mono bg-gradient-to-r from-slate-100 to-slate-200 px-1.5 py-0.5 rounded border border-slate-200/50">{bot.bot_id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30">
                        <User className="h-2.5 w-2.5 text-slate-500" />
                        <span className="text-slate-600 truncate">{assignedUser}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30">
                        <Building className="h-2.5 w-2.5 text-slate-500" />
                        <span className="text-slate-600 truncate">{bot.organization || 'No organization'}</span>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="mb-3 min-h-[1.5rem] flex items-center">
                      <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 border border-slate-200/30 w-full">
                        <div 
                          className="w-1.5 h-1.5 rounded-full shadow-sm" 
                          style={{ backgroundColor: botStatus === 'Active' ? '#10b981' : '#3b82f6' }}
                        ></div>
                        <span className="text-slate-600">
                          {bot.assigned_to ? 'Currently assigned' : 'Available for assignment'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => {
                          setSelectedItem(bot);
                          setShowManageModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg py-1.5 px-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                      >
                        <Edit className="h-2.5 w-2.5" />
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

      {/* Fixed Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-4 border-b border-gray-200">
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
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {activeView === 'users' ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  handleAddOperator(data);
                }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        name="firstname" 
                        placeholder="First Name" 
                        required 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <input 
                        name="lastname" 
                        placeholder="Last Name" 
                        required 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="Email" 
                      required 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <input 
                      name="organization" 
                      placeholder="Organization (Optional)" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm"
                    >
                      Add Operator
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)} 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              validateBotId(e.target.value.trim());
                            }
                          }}
                        />
                        
                        {botValidationStatus === 'checking' && (
                          <div className="mt-2 flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            <span className="text-sm">Validating bot ID...</span>
                          </div>
                        )}
                        
                        {botValidationStatus === 'invalid' && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                            Bot ID not found in registry. Please check the ID and try again.
                          </div>
                        )}
                        
                        {botValidationStatus === 'registered' && (
                          <div className="mt-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-2">
                            This bot is already registered and cannot be added again.
                          </div>
                        )}
                        
                        {botValidationStatus === 'valid' && (
                          <div className="mt-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2">
                            ✓ Bot ID is valid and available for registration.
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-6">
                        <button 
                          onClick={() => setBotRegistrationStep(2)}
                          disabled={botValidationStatus !== 'valid'}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm"
                        >
                          Next
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowAddModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-sm text-green-800">
                            <strong>Bot ID:</strong> {validatedBotId}
                          </div>
                        </div>
                        
                        <input 
                          name="name" 
                          placeholder="Bot Name" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <input 
                          name="organization" 
                          placeholder="Organization (Optional)" 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <textarea 
                          name="notes" 
                          placeholder="Notes (Optional)" 
                          rows={3} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        ></textarea>
                      </div>
                      
                      <div className="flex gap-3 mt-6">
                        <button 
                          type="submit" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm"
                        >
                          Register Bot
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setBotRegistrationStep(1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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

      {/* Enhanced Manage Modal */}
      {showManageModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200">
            <div className="p-4 border-b border-gray-200">
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
                    setUserManageTab('profile');
                    setHasUserChanges(false);
                    setIsEditingUser(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {activeView === 'users' ? (
                <div className="space-y-6">
                  {/* Tab Navigation for Users */}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setUserManageTab('profile')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        userManageTab === 'profile'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setUserManageTab('bots')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        userManageTab === 'bots'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Assigned Bots
                    </button>
                  </div>

                  {userManageTab === 'profile' ? (
                    <div className="space-y-4">
                      {/* Profile Edit Form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            {isEditingUser ? (
                              <input
                                type="text"
                                value={editUserData.firstname || ''}
                                onChange={(e) => handleUserFieldChange('firstname', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            ) : (
                              <div className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                                {(selectedItem as User).firstname}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            {isEditingUser ? (
                              <input
                                type="text"
                                value={editUserData.lastname || ''}
                                onChange={(e) => handleUserFieldChange('lastname', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            ) : (
                              <div className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                                {(selectedItem as User).lastname}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          {isEditingUser ? (
                            <input
                              type="email"
                              value={editUserData.email || ''}
                              onChange={(e) => handleUserFieldChange('email', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          ) : (
                            <div className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                              {(selectedItem as User).email}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                          {isEditingUser ? (
                            <input
                              type="text"
                              value={editUserData.organization || ''}
                              onChange={(e) => handleUserFieldChange('organization', e.target.value)}
                              placeholder="Organization (Optional)"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          ) : (
                            <div className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200">
                              {(selectedItem as User).organization || 'No organization'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <div className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 capitalize">
                            {(selectedItem as User).role.replace('_', ' ')}
                          </div>
                        </div>
                      </div>

                      {/* Profile Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        {isEditingUser ? (
                          <>
                            <button
                              onClick={handleSaveUserProfile}
                              disabled={!hasUserChanges}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelEditUser}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setIsEditingUser(true)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm"
                            >
                              Edit User
                            </button>
                            <button
                              onClick={() => handleUpdateItem({ isActive: !(selectedItem as User).isActive })}
                              className={`flex-1 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm ${
                                (selectedItem as User).isActive 
                                  ? 'bg-orange-600 hover:bg-orange-700' 
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {(selectedItem as User).isActive ? 'Deactivate User' : 'Activate User'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Assigned Bots Tab */
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Assigned Bots</h4>
                        <p className="text-xs text-gray-600 mb-3">
                          Bots currently assigned to {(selectedItem as User).firstname} {(selectedItem as User).lastname}
                        </p>
                        
                        {(() => {
                          const userBots = getUserAssignedBots(selectedItem.id);
                          
                          if (userBots.length === 0) {
                            return (
                              <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Bot className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">No bots assigned</p>
                                <p className="text-gray-400 text-xs mt-1">This user doesn&apos;t have any bots assigned yet</p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {userBots.map((bot) => (
                                <div key={bot.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                      <Cpu className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{bot.name}</p>
                                      <p className="text-xs text-gray-500 font-mono">{bot.bot_id}</p>
                                      {bot.organization && (
                                        <p className="text-xs text-gray-400">{bot.organization}</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <div className="text-right">
                                      <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                                        Active
                                      </div>
                                      {bot.assigned_at && (
                                        <p className="text-xs text-gray-400 mt-1">
                                          Since {bot.assigned_at.toDate().toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                    
                                    <button
                                      onClick={() => handleUnlinkBot(bot.id)}
                                      className="bg-red-100 hover:bg-red-200 text-red-600 rounded-lg p-2 text-xs font-medium transition-colors"
                                      title="Unlink bot"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Bot management section
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setManageTab('assign')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        manageTab === 'assign'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Assignment
                    </button>
                    <button
                      onClick={() => setManageTab('unregister')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        manageTab === 'unregister'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Unregister
                    </button>
                  </div>

                  {manageTab === 'assign' ? (
                    <>
                      {/* Current Assignment Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Assignment</h4>
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
                            className="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors shadow-sm"
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors shadow-sm"
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
                            className="flex-1 border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors shadow-sm"
                        >
                          Confirm Unregister Bot
                        </button>
                        <button 
                          onClick={() => setManageTab('assign')}
                          className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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