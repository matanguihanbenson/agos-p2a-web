import Swal from 'sweetalert2';

// Modern, compact alert configuration matching system design
const alertConfig = {
  success: {
    icon: 'success' as const,
    confirmButtonColor: '#10b981',
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    zIndex: 99999,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(236,254,255,0.95) 100%)',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      popup: 'modern-alert-popup',
      title: 'modern-alert-title',
      htmlContainer: 'modern-alert-content',
      timerProgressBar: 'modern-progress-bar'
    },
    width: '320px',
    padding: '1rem',
  },
  error: {
    icon: 'error' as const,
    confirmButtonColor: '#ef4444',
    showConfirmButton: true,
    zIndex: 99999,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,242,242,0.95) 100%)',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      popup: 'modern-alert-popup',
      title: 'modern-alert-title',
      htmlContainer: 'modern-alert-content',
      confirmButton: 'modern-alert-button error-button'
    },
    width: '320px',
    padding: '1rem',
  },
  warning: {
    icon: 'warning' as const,
    confirmButtonColor: '#f59e0b',
    showCancelButton: true,
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    zIndex: 99999,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,251,235,0.95) 100%)',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      popup: 'modern-alert-popup',
      title: 'modern-alert-title',
      htmlContainer: 'modern-alert-content',
      confirmButton: 'modern-alert-button warning-button',
      cancelButton: 'modern-alert-button cancel-button'
    },
    width: '360px',
    padding: '1rem',
  },
  info: {
    icon: 'info' as const,
    confirmButtonColor: '#3b82f6',
    showConfirmButton: true,
    zIndex: 99999,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      popup: 'modern-alert-popup',
      title: 'modern-alert-title',
      htmlContainer: 'modern-alert-content',
      confirmButton: 'modern-alert-button info-button'
    },
    width: '320px',
    padding: '1rem',
  },
  loading: {
    icon: 'info' as const,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    zIndex: 99999,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      popup: 'modern-alert-popup loading-popup',
      title: 'modern-alert-title',
      htmlContainer: 'modern-alert-content'
    },
    width: '280px',
    padding: '1rem',
    didOpen: () => {
      Swal.showLoading();
    },
  },
};

// User Management Alerts
export const userManagementAlerts = {
  // Success messages
  userAdded: () => Swal.fire({
    ...alertConfig.success,
    title: 'User Added Successfully!',
    html: `
      <div class="text-sm text-gray-600 space-y-1">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>User account created</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Default permissions assigned</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Email notifications enabled</span>
        </div>
      </div>
    `,
  }),

  userUpdated: () => Swal.fire({
    ...alertConfig.success,
    title: 'Profile Updated!',
    text: 'User profile information has been successfully updated.',
  }),

  userActivated: () => Swal.fire({
    ...alertConfig.success,
    title: 'User Activated!',
    text: 'The user account is now active and can access the system.',
  }),

  userDeactivated: () => Swal.fire({
    ...alertConfig.success,
    title: 'User Deactivated!',
    text: 'The user account has been deactivated and access has been revoked.',
  }),

  botUnlinked: () => Swal.fire({
    ...alertConfig.success,
    title: 'Bot Unlinked!',
    text: 'The bot has been successfully unlinked from the user.',
  }),

  // Error messages
  userAddFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Failed to Add User',
    html: `
      <div class="text-sm text-gray-600 mb-3">
        ${error || 'An error occurred while creating the user account. Please try again.'}
      </div>
      <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 border">
        If the problem persists, contact system administrator.
      </div>
    `,
  }),

  userUpdateFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Update Failed',
    text: error || 'Unable to update user profile. Please check your connection and try again.',
  }),

  userStatusUpdateFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Status Update Failed',
    text: error || 'Unable to change user status. Please try again.',
  }),

  botUnlinkFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Unlink Failed',
    text: error || 'Unable to unlink bot from user. Please try again.',
  }),

  // Warning/Confirmation messages
  confirmUserDeactivation: (userName: string) => Swal.fire({
    ...alertConfig.warning,
    title: 'Deactivate User?',
    html: `
      <div class="space-y-3">
        <p class="text-gray-700">Are you sure you want to deactivate <strong class="text-gray-900">${userName}</strong>?</p>
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div class="flex items-start space-x-2">
            <div class="w-4 h-4 text-orange-500 mt-0.5">⚠️</div>
            <div class="text-sm text-orange-800">
              <div class="font-medium mb-2">This will:</div>
              <div class="space-y-1 text-xs">
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span>Revoke system access</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span>Unassign all bots</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                  <span>Disable notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),

  confirmBotUnlink: (botName: string) => Swal.fire({
    ...alertConfig.warning,
    title: 'Unlink Bot?',
    html: `
      <div class="space-y-3">
        <p class="text-gray-700">Are you sure you want to unlink <strong class="text-gray-900">${botName}</strong>?</p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="text-sm text-blue-800">
            This will make the bot available for assignment to other operators.
          </div>
        </div>
      </div>
    `,
  }),
};

// Bot Management Alerts
export const botManagementAlerts = {
  // Success messages
  botAdded: (botId: string) => Swal.fire({
    ...alertConfig.success,
    title: 'Bot Registered Successfully!',
    html: `
      <div class="space-y-3">
        <p class="text-gray-700">Bot <strong class="text-gray-900">${botId}</strong> has been added to your fleet.</p>
        <div class="text-sm text-gray-600 space-y-1">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Registry updated</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ready for assignment</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Monitoring enabled</span>
          </div>
        </div>
      </div>
    `,
  }),

  botAssigned: (botId: string, operatorName: string) => Swal.fire({
    ...alertConfig.success,
    title: 'Bot Assigned!',
    html: `
      <div class="space-y-3">
        <p class="text-gray-700">Bot <strong class="text-gray-900">${botId}</strong> has been assigned to <strong class="text-gray-900">${operatorName}</strong>.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="text-sm text-green-800">
            The operator will receive a notification about the new assignment.
          </div>
        </div>
      </div>
    `,
  }),

  botUnregistered: (botId: string) => Swal.fire({
    ...alertConfig.success,
    title: 'Bot Unregistered!',
    html: `
      <div class="space-y-3">
        <p class="text-gray-700">Bot <strong class="text-gray-900">${botId}</strong> has been removed from your fleet.</p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="text-sm text-blue-800">
            The bot is now available for registration by other administrators.
          </div>
        </div>
      </div>
    `,
  }),

  // Error messages with compact styling
  botValidationFailed: () => Swal.fire({
    ...alertConfig.error,
    title: 'Invalid Bot ID',
    html: `
      <div class="text-sm text-gray-600 mb-3">
        The bot ID was not found in the registry. Please verify the ID and try again.
      </div>
      <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 border">
        Contact support if you believe this is an error.
      </div>
    `,
  }),

  botAlreadyRegistered: () => Swal.fire({
    ...alertConfig.error,
    title: 'Bot Already Registered',
    text: 'This bot is already registered to an administrator and cannot be added again.',
  }),

  botRegistrationFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Registration Failed',
    text: error || 'Unable to register the bot. Please try again.',
  }),

  botAssignmentFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Assignment Failed',
    text: error || 'Unable to assign bot to operator. Please try again.',
  }),

  botUnregistrationFailed: (error?: string) => Swal.fire({
    ...alertConfig.error,
    title: 'Unregistration Failed',
    text: error || 'Unable to unregister bot. Please try again.',
  }),

  // Warning/Confirmation messages
  confirmBotUnregistration: (botId: string, botName: string) => Swal.fire({
    ...alertConfig.warning,
    title: 'Unregister Bot?',
    html: `
      <div class="space-y-4">
        <p class="text-gray-700">Are you sure you want to unregister <strong class="text-gray-900">${botName}</strong> (${botId})?</p>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <div class="flex items-start space-x-2">
            <div class="w-4 h-4 text-red-500 mt-0.5">⚠️</div>
            <div class="text-sm text-red-800">
              <div class="font-medium text-red-700 mb-2">This action cannot be undone!</div>
              <div class="space-y-1 text-xs">
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Remove bot from your fleet</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Unassign from current operator</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Stop all monitoring</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>Make bot available to other admins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: 'Yes, unregister',
    confirmButtonColor: '#ef4444',
  }),
};

// Loading states with compact design
export const loadingAlerts = {
  validatingBot: () => Swal.fire({
    ...alertConfig.loading,
    title: 'Validating Bot ID...',
    html: '<div class="text-sm text-gray-600">Checking bot registry, please wait.</div>',
  }),

  savingUser: () => Swal.fire({
    ...alertConfig.loading,
    title: 'Saving User...',
    html: '<div class="text-sm text-gray-600">Updating user information, please wait.</div>',
  }),

  assigningBot: () => Swal.fire({
    ...alertConfig.loading,
    title: 'Assigning Bot...',
    html: '<div class="text-sm text-gray-600">Processing bot assignment, please wait.</div>',
  }),
};

// Generic utility functions
export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...alertConfig.success,
    title,
    text,
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...alertConfig.error,
    title,
    text,
  });
};

export const showConfirmation = (title: string, text: string, confirmText = 'Yes, proceed') => {
  return Swal.fire({
    ...alertConfig.warning,
    title,
    text,
    confirmButtonText: confirmText,
  });
};

export const closeAlert = () => {
  Swal.close();
};
