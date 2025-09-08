// =========================
// ENHANCED JAVASCRIPT FUNCTIONALITY
// =========================

class FocusHive {
  constructor() {
    this.isCollapsed = false;
    this.onlineCount = 408;
    this.streakCount = 0;
    this.userStatus = 'online'; // online, idle, away
    this.activeTimers = new Map();
    this.init();
  }

  init() {
    this.initSidebar();
    this.initThemeToggle();
    this.initStreamUpdates();
    this.initToolTips();
    this.initAnimations();
    this.initKeyboardShortcuts();
    this.simulateRealTimeUpdates();
    this.initUserPresence();
    //this.initJoinLeaveRoom();
    this.initPomodoro();
  }

  // Sidebar functionality
  initSidebar() {
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    toggleBtn.addEventListener('click', () => {
      this.toggleSidebar();
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });

    // Handle responsive sidebar
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('collapsed');
      } else {
        sidebar.classList.remove('active');
      }
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth <= 992) {
      // Mobile: toggle active class
      sidebar.classList.toggle('active');
    } else {
      // Desktop: toggle collapsed class
      sidebar.classList.toggle('collapsed');
      this.isCollapsed = !this.isCollapsed;
    }
  }

  // Theme toggle functionality
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('change', () => {
      this.toggleTheme(themeToggle.checked);
    });
  }

  toggleTheme(isLight) {
    const body = document.body;
    if (!isLight) {
      body.classList.add('dark-theme');
      // You can add dark theme CSS variables here
    } else {
      body.classList.remove('dark-theme');
    }
  }

  // Stream updates and interactions
  initStreamUpdates() {
    const joinButtons = document.querySelectorAll('.join-stream');
    const videoCards = document.querySelectorAll('.video-card');

    joinButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = button.closest('.video-card');
        const streamerName = card.querySelector('.streamer-name').textContent.trim();
        this.showJoinRoomPopup(streamerName);
      });
    });

    videoCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.join-stream')) {
          const streamerName = card.querySelector('.streamer-name').textContent.trim();
          this.showRoomPreview(streamerName);
        }
      });
    });
  }
  initToolTips() {
    // Initialize tooltips for right sidebar icons
    const toolIcons = document.querySelectorAll('.tool-icon');
    toolIcons.forEach(icon => {
      const tool = icon.getAttribute('data-tool');
      icon.setAttribute('title', this.getToolTipText(tool));
    });
  }

  getToolTipText(tool) {
    const toolTips = {
      'ai': 'AI Study Buddy - Get help with your studies',
      'flashcards': 'Flashcards - Create and study flashcards',
      'calendar': 'Calendar / Tasks - Manage your study schedule',
      'notes': 'Notes / Whiteboard - Jot down important points',
      'chat': 'Chat - Message other students'
    };
    return toolTips[tool] || 'Tool';
  }
  initAnimations() {
    // Initialize any custom animations
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Toggle sidebar with Ctrl+B or Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      }
      
      // Escape key to close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }
   closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      modal.remove();
    });
  }
   simulateRealTimeUpdates() {
    // Simulate viewer count changes
    setInterval(() => {
      const viewerCounts = document.querySelectorAll('.viewer-count');
      viewerCounts.forEach(countEl => {
        const currentCount = parseInt(countEl.textContent);
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = Math.max(1, currentCount + change);
        countEl.textContent = newCount;
        
        // Add animation effect
        countEl.classList.add('count-update');
        setTimeout(() => {
          countEl.classList.remove('count-update');
        }, 500);
      });
    }, 10000);
  }

   // =========================
  // NEW FEATURES IMPLEMENTATION
  // =========================

  // 1. User Presence & Status
  initUserPresence() {
    this.updateUserStatusIndicator();
    
    // Detect user activity to set status
    let activityTimer;
    const events = ['mousemove', 'keypress', 'click', 'scroll'];
    
    const setActive = () => {
      this.userStatus = 'online';
      this.updateUserStatusIndicator();
      
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        this.userStatus = 'idle';
        this.updateUserStatusIndicator();
        
        // After longer inactivity, set to away
        setTimeout(() => {
          if (this.userStatus === 'idle') {
            this.userStatus = 'away';
            this.updateUserStatusIndicator();
          }
        }, 300000); // 5 minutes
      }, 120000); // 2 minutes
    };
    
    events.forEach(event => {
      document.addEventListener(event, setActive);
    });
    
    // Check visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.userStatus = 'away';
      } else {
        this.userStatus = 'online';
      }
      this.updateUserStatusIndicator();
    });
  }

  updateUserStatusIndicator() {
    let statusIndicator = document.querySelector('.user-status-indicator');
    if (!statusIndicator) {
      // Create status indicator if it doesn't exist
      const userControls = document.querySelector('.user-controls');
      statusIndicator = document.createElement('div');
      statusIndicator.className = 'user-status-indicator';
      userControls.querySelector('span').prepend(statusIndicator);
    }
    
    // Update indicator based on status
    statusIndicator.className = `user-status-indicator status-${this.userStatus}`;
    statusIndicator.title = this.getStatusText(this.userStatus);
  }

  getStatusText(status) {
    const statusTexts = {
      'online': 'Online',
      'idle': 'Idle',
      'away': 'Away'
    };
    return statusTexts[status] || 'Unknown';
  }

// 2. Join / Leave Room popup
showJoinRoomPopup(streamerName) {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal join-room-modal">
      <div class="modal-header">
        <h3>Join ${streamerName}'s Study Room</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="room-preview">
          <div class="preview-header">
            <span class="live-indicator">
              <span class="live-dot"></span> LIVE
            </span>
            <span class="viewer-count">${Math.floor(Math.random() * 100) + 50} watching</span>
          </div>
          <div class="preview-content">
            <p>This room is focused on deep work. Microphones are muted by default.</p>
            <div class="study-focus">
              <strong>Study Focus:</strong> 
              <span class="focus-tags">
                <span class="focus-tag">Concentration</span>
                <span class="focus-tag">No Distractions</span>
              </span>
            </div>
          </div>
        </div>
        <div class="join-options">
          <label>
            <input type="checkbox" id="enable-mic"> Enable Microphone
          </label>
          <label>
            <input type="checkbox" id="enable-cam"> Enable Camera
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="cancel-join">Cancel</button>
        <button class="btn-primary" id="confirm-join">Join Room</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalOverlay);
  
  // Add event listeners
  modalOverlay.querySelector('.close-modal').addEventListener('click', () => {
    modalOverlay.remove();
  });
  
  modalOverlay.querySelector('#cancel-join').addEventListener('click', () => {
    modalOverlay.remove();
  });
  
  modalOverlay.querySelector('#confirm-join').addEventListener('click', () => {
    this.joinRoom(streamerName);
    modalOverlay.remove();
  });
  
  // Close modal when clicking outside
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
}

joinRoom(streamerName) {
  // Update UI to show user is in a room
  const finishSessionBtn = document.querySelector('#topbar button');
  finishSessionBtn.innerHTML = '<i class="fas fa-door-open"></i> Leave Room';
  finishSessionBtn.dataset.room = streamerName;
  
  // Show notification
  this.showNotification(`You've joined ${streamerName}'s study room!`, 'success');
}

leaveRoom() {
  const finishSessionBtn = document.querySelector('#topbar button');
  const roomName = finishSessionBtn.dataset.room;
  
  if (roomName) {
    finishSessionBtn.innerHTML = '<i class="fas fa-stop"></i> Finish Session';
    delete finishSessionBtn.dataset.room;
    
    // Show notification
    this.showNotification(`You've left ${roomName}'s study room`, 'info');
  }
}

showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${this.getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Set up close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

getNotificationIcon(type) {
  const icons = {
    'success': 'check-circle',
    'error': 'exclamation-circle',
    'warning': 'exclamation-triangle',
    'info': 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// Add this method to your FocusHive class
showPomodoroTimer() {
  // Create dedicated pomodoro overlay (not using modal-overlay class)
  const pomodoroOverlay = document.createElement('div');
  pomodoroOverlay.className = 'pomodoro-overlay';
  pomodoroOverlay.innerHTML = `
    <div class="pomodoro-modal">
      <div class="pomodoro-header">
        <h3><i class="fas fa-clock"></i> Focus Session</h3>
        <p>50 minutes work • 10 minutes break</p>
        <button class="close-pomodoro">&times;</button>
      </div>
      <div class="pomodoro-body">
        <div class="timer-container">
          <div class="timer-circle" id="timer-circle">
            <div class="timer-inner">
              <div class="timer-time" id="timer-time">50:00</div>
              <div class="timer-label" id="timer-label">WORK TIME</div>
            </div>
          </div>
        </div>
        
        <div class="motivational-quote">
          <span id="motivational-quote">"The future depends on what you do today."</span>
          <span class="quote-author" id="quote-author">- Mahatma Gandhi</span>
        </div>
        
        <div class="pomodoro-controls">
          <button class="pomodoro-btn btn-start" id="start-timer">
            <i class="fas fa-play"></i> Start
          </button>
          <button class="pomodoro-btn btn-pause" id="pause-timer" disabled>
            <i class="fas fa-pause"></i> Pause
          </button>
          <button class="pomodoro-btn btn-reset" id="reset-timer">
            <i class="fas fa-redo"></i> Reset
          </button>
        </div>
        
        <div class="session-info">
          <div class="session-item">
            <span class="session-value" id="completed-sessions">0</span>
            <span>Sessions</span>
          </div>
          <div class="session-item">
            <span class="session-value" id="total-focus-time">0</span>
            <span>Minutes</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(pomodoroOverlay);
  
  // Initialize timer variables
  let workTime = 50 * 60; // 50 minutes in seconds
  let breakTime = 10 * 60; // 10 minutes in seconds
  let timeLeft = workTime;
  let isWorking = true;
  let isRunning = false;
  let timerInterval = null;
  let completedSessions = 0;
  let totalFocusTime = 0;
  
  // Motivational quotes array
  const motivationalQuotes = [
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" }
  ];
  
  // Get DOM elements
  const timerTime = document.getElementById('timer-time');
  const timerLabel = document.getElementById('timer-label');
  const timerCircle = document.getElementById('timer-circle');
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');
  const motivationalQuote = document.getElementById('motivational-quote');
  const quoteAuthor = document.getElementById('quote-author');
  const completedSessionsEl = document.getElementById('completed-sessions');
  const totalFocusTimeEl = document.getElementById('total-focus-time');
  const closeBtn = pomodoroOverlay.querySelector('.close-pomodoro');
  
  // Update motivational quote
  function updateQuote() {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    motivationalQuote.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
  }
  
  // Update timer display
  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update circular progress
    const totalTime = isWorking ? workTime : breakTime;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    timerCircle.style.background = `conic-gradient(var(${isWorking ? '--primary' : '--accent'}) ${progress}%, var(--gray-200) 0%)`;
  }
  
  // Start timer
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      
      timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          
          if (isWorking) {
            // Work session completed
            completedSessions++;
            totalFocusTime += workTime / 60;
            completedSessionsEl.textContent = completedSessions;
            totalFocusTimeEl.textContent = totalFocusTime;
            
            // Switch to break time
            isWorking = false;
            timeLeft = breakTime;
            timerLabel.textContent = 'BREAK TIME';
            timerLabel.style.color = 'var(--accent)';
            timerCircle.classList.add('timer-complete');
            
            // Show notification
            this.showNotification('Work session completed! Time for a break.', 'success');
          } else {
            // Break completed, switch back to work
            isWorking = true;
            timeLeft = workTime;
            timerLabel.textContent = 'WORK TIME';
            timerLabel.style.color = 'var(--gray-800)';
            timerCircle.classList.remove('timer-complete');
            
            // Show notification
            this.showNotification('Break time over! Back to work.', 'info');
          }
          
          // Update quote for new session
          updateQuote();
          
          // Auto-start next session
          setTimeout(() => startTimer(), 2000);
        }
        
        updateTimer();
      }, 1000);
    }
  }
  
  // Pause timer
  function pauseTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }
  
  // Reset timer
  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isWorking = true;
    timeLeft = workTime;
    timerLabel.textContent = 'WORK TIME';
    timerLabel.style.color = 'var(--gray-800)';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerCircle.classList.remove('timer-complete');
    updateTimer();
    updateQuote();
  }
  
  // Close timer
  function closeTimer() {
    pauseTimer();
    pomodoroOverlay.remove();
  }
  
  // Set up event listeners
  startBtn.addEventListener('click', startTimer.bind(this));
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  closeBtn.addEventListener('click', closeTimer);
  
  // Close timer when clicking outside
  pomodoroOverlay.addEventListener('click', (e) => {
    if (e.target === pomodoroOverlay) {
      closeTimer();
    }
  });
  
  // Close with Escape key
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      closeTimer();
      document.removeEventListener('keydown', handleEscapeKey);
    }
  };
  document.addEventListener('keydown', handleEscapeKey);
  
  // Initialize timer display
  updateTimer();
  updateQuote();
  
  // Auto-rotate quotes every 2 minutes
  const quoteInterval = setInterval(updateQuote, 120000);
  
  // Clean up interval when modal is closed
  pomodoroOverlay.addEventListener('remove', () => {
    clearInterval(quoteInterval);
    document.removeEventListener('keydown', handleEscapeKey);
  });

}

// Add this to your init() method to handle the Start Working button
initPomodoro() {
  const startWorkingBtn = document.getElementById('start-working-btn');
  console.log('Start working button:', startWorkingBtn); // Add this line
  
  if (startWorkingBtn) {
    console.log('Adding event listener to button'); // Add this line
    startWorkingBtn.addEventListener('click', () => {
      console.log('Button clicked!'); // Add this line
      this.showPomodoroTimer();
    });
  } else {
    console.log('Button not found!'); // Add this line
  }
}
}


document.addEventListener('DOMContentLoaded', () => {
    window.focusHive = new FocusHive();
  })