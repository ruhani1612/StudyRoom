
        // User data management
        let userData = {
            fullName: '',
            email: '',
            phone: '',
            bio: '',
            profileImage: null,
            studyHours: 245,
            dayStreak: 7,
            weeklyGoal: 89
        };

        let selectedImageFile = null;
        let editMode = false;

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
            renderTodos();
            updateStats();
            initializeAnimations();
            
            // Set up event listeners
            document.getElementById('avatar-upload').addEventListener('change', handleImageUpload);
            document.getElementById('personal-info-form').addEventListener('submit', handleFormSubmit);
            
            // Initialize edit mode
            const formInputs = document.querySelectorAll('#personal-info-form .form-input');
            formInputs.forEach(input => {
                input.setAttribute('readonly', true);
                input.style.backgroundColor = '#f8f9fa';
                input.style.cursor = 'not-allowed';
            });
        });

        // Load user data from local storage
        function loadUserData() {
            const savedData = localStorage.getItem('focusHiveUserData');
            if (savedData) {
                userData = JSON.parse(savedData);
                populateForm();
                updateProfileDisplay();
            }
        }

        // Save user data to local storage
        function saveUserData() {
            localStorage.setItem('focusHiveUserData', JSON.stringify(userData));
        }

        // Populate form with user data
        function populateForm() {
            document.getElementById('fullName').value = userData.fullName || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('bio').value = userData.bio || '';
            
            if (userData.profileImage) {
                document.getElementById('avatar-preview').src = userData.profileImage;
                document.getElementById('avatar-preview').style.display = 'block';
                document.getElementById('avatar-initial').style.display = 'none';
                document.getElementById('profile-avatar-container').classList.add('has-image');
            }
        }

        // Update profile display elements
        function updateProfileDisplay() {
            document.getElementById('profile-name').textContent = userData.fullName || 'Welcome to FocusHive!';
            document.getElementById('study-hours').textContent = userData.studyHours || 0;
            document.getElementById('day-streak').textContent = userData.dayStreak || 0;
            document.getElementById('weekly-goal').textContent = (userData.weeklyGoal || 0) + '%';
        }

        // Toggle edit mode for personal information
        function toggleEditMode() {
            editMode = !editMode;
            const formInputs = document.querySelectorAll('#personal-info-form .form-input');
            const editBtn = document.getElementById('edit-info-btn');
            
            if (editMode) {
                // Enable editing
                formInputs.forEach(input => {
                    input.removeAttribute('readonly');
                    input.style.backgroundColor = '#fff';
                    input.style.cursor = 'text';
                });
                editBtn.innerHTML = '🔒 Save Changes';
                editBtn.classList.add('editing');
            } else {
                // Disable editing and save changes
                formInputs.forEach(input => {
                    input.setAttribute('readonly', true);
                    input.style.backgroundColor = '#f8f9fa';
                    input.style.cursor = 'not-allowed';
                });
                editBtn.innerHTML = '✏️ Edit Information';
                editBtn.classList.remove('editing');
                
                // Save the changes
                handleFormSubmit(new Event('submit'));
            }
        }

        // Delete profile picture
        function deleteProfilePicture() {
            if (confirm("Are you sure you want to delete your profile picture?")) {
                // Remove profile image from userData and update UI
                userData.profileImage = null;
                
                // Reset to initial avatar
                document.getElementById('avatar-preview').src = '';
                document.getElementById('avatar-preview').style.display = 'none';
                document.getElementById('avatar-initial').style.display = 'flex';
                document.getElementById('profile-avatar-container').classList.remove('has-image');
                
                // Save changes
                saveUserData();
                
                // Show confirmation message
                showToast('Profile picture deleted successfully!', 'success');
                
                // Hide the popup
                hidePopup('image-popup');
            }
        }

        // Handle image upload with validation
        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                showToast('Please select a valid image file (JPEG, PNG, GIF, or WEBP)', 'error');
                return;
            }
            
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast('Image size must be less than 2MB', 'error');
                return;
            }
            
            // Preview image
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('avatar-preview').src = e.target.result;
                document.getElementById('avatar-preview').style.display = 'block';
                document.getElementById('avatar-initial').style.display = 'none';
                document.getElementById('profile-avatar-container').classList.add('has-image');
                
                // Add delete button to the popup if there's an existing image
                if (userData.profileImage) {
                    const popup = document.getElementById('image-popup');
                    if (!popup.querySelector('.btn-danger')) {
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'btn-danger';
                        deleteBtn.innerHTML = '🗑️ Delete Current';
                        deleteBtn.onclick = deleteProfilePicture;
                        popup.querySelector('.popup-buttons').appendChild(deleteBtn);
                    }
                }
                
                // Store the file for confirmation
                selectedImageFile = file;
                
                // Show confirmation popup
                showPopup('image-popup');
            };
            reader.readAsDataURL(file);
        }

        // Confirm image update
        function confirmImageUpdate() {
            if (selectedImageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    userData.profileImage = e.target.result;
                    saveUserData();
                    hidePopup('image-popup');
                    showToast('Profile picture updated successfully!', 'success');
                };
                reader.readAsDataURL(selectedImageFile);
            }
        }

        // Handle form submission with validation
        function handleFormSubmit(event) {
            event.preventDefault();
            
            if (validateForm()) {
                // Get form values
                userData.fullName = document.getElementById('fullName').value;
                userData.email = document.getElementById('email').value;
                userData.phone = document.getElementById('phone').value;
                userData.bio = document.getElementById('bio').value;
                
                // Save data
                saveUserData();
                
                // Update profile display
                updateProfileDisplay();
                
                // Show success message
                showToast('Profile updated successfully!', 'success');
                
                // Animate save button if in edit mode
                if (editMode) {
                    const submitBtn = event.target.querySelector('.btn-primary');
                    animateSaveButton(submitBtn);
                }
            }
        }

        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Validate full name
            const fullName = document.getElementById('fullName').value.trim();
            if (!fullName) {
                showError('fullName', 'Full name is required');
                isValid = false;
            } else {
                clearError('fullName');
            }
            
            // Validate email
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('email');
            }
            
            // Validate phone (optional)
            const phone = document.getElementById('phone').value.trim();
            if (phone) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(phone.replace(/[\(\)\-\s]/g, ''))) {
                    showError('phone', 'Please enter a valid phone number');
                    isValid = false;
                } else {
                    clearError('phone');
                }
            } else {
                clearError('phone');
            }
            
            // Validate bio length
            const bio = document.getElementById('bio').value.trim();
            if (bio.length > 200) {
                showError('bio', 'Bio cannot exceed 200 characters');
                isValid = false;
            } else {
                clearError('bio');
            }
            
            return isValid;
        }

        // Show error message
        function showError(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const inputElement = document.getElementById(fieldId);
            
            errorElement.textContent = message;
            errorElement.classList.add('show');
            inputElement.classList.add('error');
        }

        // Clear error message
        function clearError(fieldId) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const inputElement = document.getElementById(fieldId);
            
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            inputElement.classList.remove('error');
        }

        // Reset form to saved values
        function resetForm() {
            populateForm();
            showToast('Form reset to saved values', 'info');
        }

        // Show popup
        function showPopup(popupId) {
            document.getElementById(popupId).classList.add('active');
        }

        // Hide popup
        function hidePopup(popupId) {
            document.getElementById(popupId).classList.remove('active');
        }

        // Show toast notification
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            const toastIcon = document.getElementById('toast-icon');
            const toastMessage = document.getElementById('toast-message');
            
            // Set content and style
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            
            // Set icon based on type
            if (type === 'success') {
                toastIcon.textContent = '✅';
            } else if (type === 'error') {
                toastIcon.textContent = '❌';
            } else {
                toastIcon.textContent = 'ℹ️';
            }
            
            // Show toast
            toast.classList.add('visible');
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('visible');
            }, 3000);
        }

        // Animate save button
        function animateSaveButton(button) {
            const originalText = button.textContent;
            button.innerHTML = '<span class="spinner"></span>Saving...';
            button.style.background = '#34a853';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Saved!';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#4285f4';
                    button.disabled = false;
                }, 1000);
            }, 1000);
        }

        // To-Do List Data (in-memory storage)
        let todos = [
            { id: 1, text: "Review Mathematics Chapter 5", completed: false, priority: 'high' },
            { id: 2, text: "Complete Physics Assignment", completed: true, priority: 'medium' },
            { id: 3, text: "Prepare Chemistry Lab Report", completed: false, priority: 'low' }
        ];
        let nextId = 4;

        // Add new todo
        function addTodo() {
            const input = document.getElementById('todo-input');
            const priority = document.getElementById('priority-selector').value;
            const text = input.value.trim();

            if (text === '') {
                input.style.borderColor = '#dc3545';
                setTimeout(() => {
                    input.style.borderColor = '#e1e5e9';
                }, 2000);
                return;
            }

            const newTodo = {
                id: nextId++,
                text: text,
                completed: false,
                priority: priority
            };

            todos.push(newTodo);
            input.value = '';
            renderTodos();
            updateStats();

            // Add animation
            const todoItems = document.querySelectorAll('.todo-item');
            const lastItem = todoItems[todoItems.length - 1];
            if (lastItem) {
                lastItem.style.animation = 'slideInFromRight 0.3s ease';
            }
        }

        // Toggle todo completion
        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
                updateStats();
            }
        }

        // Delete todo
        function deleteTodo(id) {
            const todoElement = document.querySelector(`[data-id="${id}"]`);
            if (todoElement) {
                todoElement.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    todos = todos.filter(t => t.id !== id);
                    renderTodos();
                    updateStats();
                }, 300);
            }
        }

        // Render todos
        function renderTodos() {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';

            todos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                todoItem.setAttribute('data-id', todo.id);

                todoItem.innerHTML = `
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})">
                        ${todo.completed ? '✓' : ''}
                    </div>
                    <span class="todo-text">${todo.text}</span>
                    <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                    <div class="todo-actions">
                        <button class="todo-delete" onclick="deleteTodo(${todo.id})">🗑️</button>
                    </div>
                `;

                todoList.appendChild(todoItem);
            });
        }

        // Update statistics
        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(t => t.completed).length;
            const pending = total - completed;

            document.getElementById('total-tasks').textContent = total;
            document.getElementById('completed-tasks').textContent = completed;
            document.getElementById('pending-tasks').textContent = pending;
        }

        // Allow Enter key to add todo
        document.getElementById('todo-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Toggle settings
        function toggleSetting(toggle) {
            toggle.classList.toggle('active');
            
            // Add a little bounce animation
            toggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
        }

        // Initialize animations and effects
        function initializeAnimations() {
            // Add hover effects to cards
            const cards = document.querySelectorAll('.profile-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                });
            });

            // Add loading animation to stats
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const finalValue = stat.textContent;
                if (!isNaN(parseInt(finalValue))) {
                    const finalNum = parseInt(finalValue);
                    let currentNum = 0;
                    const increment = finalNum / 50;
                    
                    const counter = setInterval(() => {
                        currentNum += increment;
                        if (currentNum >= finalNum) {
                            stat.textContent = finalValue;
                            clearInterval(counter);
                        } else {
                            stat.textContent = Math.floor(currentNum) + (finalValue.includes('%') ? '%' : '');
                        }
                    }, 30);
                }
            });
        }

        // Add ripple effect to buttons
        function createRipple(event) {
            const button = event.currentTarget;
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
            circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
            circle.classList.add('ripple');

            const ripple = button.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            button.appendChild(circle);
        }

        // Add ripple effect CSS
        const style = document.createElement('style');
        style.textContent = `
            .btn-primary, .btn-secondary, .btn-danger, .add-todo-btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-20px);
                }
            }
        `;
        document.head.appendChild(style);

        // Apply ripple effect to all buttons
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-danger, .add-todo-btn').forEach(button => {
            button.addEventListener('click', createRipple);
        });
        // Add delete button to profile picture container
function addDeleteButton() {
    const avatarContainer = document.getElementById('profile-avatar-container');
    let deleteBtn = document.getElementById('avatar-delete-btn');
    
    if (!deleteBtn) {
        deleteBtn = document.createElement('div');
        deleteBtn.id = 'avatar-delete-btn';
        deleteBtn.className = 'avatar-delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete profile picture';
        deleteBtn.onclick = deleteProfilePicture;
        avatarContainer.appendChild(deleteBtn);
    }
    
    // Show delete button only if there's a profile image
    if (userData.profileImage) {
        deleteBtn.style.display = 'flex';
    } else {
        deleteBtn.style.display = 'none';
    }
}

// Enhanced delete profile picture function
function deleteProfilePicture() {
    // Create a custom confirmation popup
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'popup-overlay active';
    confirmPopup.innerHTML = `
        <div class="popup">
            <div class="popup-icon">🗑️</div>
            <h3 class="popup-title">Delete Profile Picture</h3>
            <p class="popup-message">Are you sure you want to delete your profile picture?</p>
            <div class="popup-buttons">
                <button class="btn-secondary" onclick="document.body.removeChild(this.parentElement.parentElement.parentElement)">Cancel</button>
                <button class="btn-danger" onclick="confirmDeleteProfilePicture()">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPopup);
}

// Confirm and execute profile picture deletion
function confirmDeleteProfilePicture() {
    // Remove profile image from userData
    userData.profileImage = null;
    
    // Reset to initial avatar
    document.getElementById('avatar-preview').src = '';
    document.getElementById('avatar-preview').style.display = 'none';
    document.getElementById('avatar-initial').style.display = 'flex';
    document.getElementById('profile-avatar-container').classList.remove('has-image');
    
    // Hide delete button
    const deleteBtn = document.getElementById('avatar-delete-btn');
    if (deleteBtn) {
        deleteBtn.style.display = 'none';
    }
    
    // Save changes
    saveUserData();
    
    // Remove the confirmation popup
    const popups = document.querySelectorAll('.popup-overlay');
    popups.forEach(popup => {
        if (popup.innerHTML.includes('Delete Profile Picture')) {
            document.body.removeChild(popup);
        }
    });
    
    // Show confirmation message
    showToast('Profile picture deleted successfully!', 'success');
}

// Update the handleImageUpload function to show delete button after upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        showToast('Please select a valid image file (JPEG, PNG, GIF, or WEBP)', 'error');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image size must be less than 2MB', 'error');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('avatar-preview').src = e.target.result;
        document.getElementById('avatar-preview').style.display = 'block';
        document.getElementById('avatar-initial').style.display = 'none';
        document.getElementById('profile-avatar-container').classList.add('has-image');
        
        // Show delete button
        addDeleteButton();
        
        // Store the file for confirmation
        selectedImageFile = file;
        
        // Show confirmation popup
        showPopup('image-popup');
    };
    reader.readAsDataURL(file);
}

// Update the loadUserData function to show delete button if image exists
function loadUserData() {
    const savedData = localStorage.getItem('focusHiveUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
        populateForm();
        updateProfileDisplay();
        
        // Add delete button if profile image exists
        addDeleteButton();
    }
}
    // Delete profile picture function
function deleteProfilePicture() {
    // Create a custom confirmation popup
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'popup-overlay active';
    confirmPopup.innerHTML = `
        <div class="popup">
            <div class="popup-icon">🗑️</div>
            <h3 class="popup-title">Delete Profile Picture</h3>
            <p class="popup-message">Are you sure you want to delete your profile picture?</p>
            <div class="popup-buttons">
                <button class="btn-secondary" onclick="document.body.removeChild(this.parentElement.parentElement.parentElement)">Cancel</button>
                <button class="btn-danger" onclick="confirmDeleteProfilePicture()">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPopup);
}

// Confirm and execute profile picture deletion
function confirmDeleteProfilePicture() {
    // Remove profile image from userData
    userData.profileImage = null;
    
    // Reset to initial avatar
    document.getElementById('avatar-preview').src = '';
    document.getElementById('avatar-preview').style.display = 'none';
    document.getElementById('avatar-initial').style.display = 'flex';
    document.getElementById('profile-avatar-container').classList.remove('has-image');
    
    // Save changes
    saveUserData();
    
    // Remove the confirmation popup
    const popups = document.querySelectorAll('.popup-overlay');
    popups.forEach(popup => {
        if (popup.innerHTML.includes('Delete Profile Picture')) {
            document.body.removeChild(popup);
        }
    });
    
    // Show confirmation message
    showToast('Profile picture deleted successfully!', 'success');
}

// Update the handleImageUpload function to always show delete button
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        showToast('Please select a valid image file (JPEG, PNG, GIF, or WEBP)', 'error');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image size must be less than 2MB', 'error');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('avatar-preview').src = e.target.result;
        document.getElementById('avatar-preview').style.display = 'block';
        document.getElementById('avatar-initial').style.display = 'none';
        document.getElementById('profile-avatar-container').classList.add('has-image');
        
        // Store the file for confirmation
        selectedImageFile = file;
        
        // Show confirmation popup
        showPopup('image-popup');
    };
    reader.readAsDataURL(file);
}

// Update the confirmImageUpdate function
function confirmImageUpdate() {
    if (selectedImageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.profileImage = e.target.result;
            saveUserData();
            hidePopup('image-popup');
            showToast('Profile picture updated successfully!', 'success');
        };
        reader.readAsDataURL(selectedImageFile);
    }
}

// Update the loadUserData function to handle avatar display
function loadUserData() {
    const savedData = localStorage.getItem('focusHiveUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
        populateForm();
        updateProfileDisplay();
        
        // Show avatar preview if image exists
        if (userData.profileImage) {
            document.getElementById('avatar-preview').src = userData.profileImage;
            document.getElementById('avatar-preview').style.display = 'block';
            document.getElementById('avatar-initial').style.display = 'none';
            document.getElementById('profile-avatar-container').classList.add('has-image');
        }
    }
}
