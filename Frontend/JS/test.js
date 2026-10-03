// ============================================
// PROFILE PAGE FUNCTIONALITY
// ============================================

// Profile Picture Upload Handler
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const profilePicture = document.getElementById('profilePicture');

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});//Ties the upload button to the File input

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profilePicture.src = event.target.result;//Sets the profile pic to the file that has been read
            // TODO: Send image to backend for storage
            console.log('Profile picture updated');
        };
        reader.readAsDataURL(file);
    }
});

// Load User Data from Database
function loadUserProfile() {
    // TODO: Fetch user data from backend API
    // This is a placeholder implementation
    
    const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        gender: 'male',
        dateOfBirth: '1990-05-15',
        membershipDate: '2024-01-15',
        profilePicture: '../images/pngfind.com-placeholder-png-6104451.png'
    };

    // Populate user info
    document.getElementById('userName').innerHTML = 
        `<span class="welcome-greeting">Welcome</span><span class="user-name">${userData.firstName} ${userData.lastName}</span>`;
    
    document.getElementById('fullName').value = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('gender').value = userData.gender;
    document.getElementById('dob').value = userData.dateOfBirth;
    document.getElementById('membershipDate').value = userData.membershipDate;
    document.getElementById('profilePicture').src = userData.profilePicture;
}

// Load Prayer Requests from Database
function loadPrayerRequests() {
    // TODO: Fetch prayer requests from backend API
    // This is a placeholder implementation - the HTML already has sample data
    
    const prayerRequests = [
        {
            title: 'Healing and Strength',
            content: 'Please pray for my mother\'s speedy recovery from her recent surgery. We trust in God\'s healing power and believe in His love and compassion.',
            dateTime: 'January 15, 2024 at 2:30 PM'
        },
        {
            title: 'Guidance for New Job',
            content: 'I have been offered a new position at work and need wisdom to make the right decision. Please pray that God guides my steps and leads me toward His purpose.',
            dateTime: 'January 10, 2024 at 11:15 AM'
        },
        {
            title: 'Family Unity',
            content: 'My family is going through some tough times and we\'ve been distant lately. I pray that God restores our bond and brings us closer together in love and understanding.',
            dateTime: 'January 5, 2024 at 6:45 PM'
        }
    ];

    // In a real scenario, you would dynamically generate this from the database
    console.log('Prayer requests loaded:', prayerRequests);
}

// Edit Information Handler
const editInfoBtn = document.getElementById('editInfoBtn');
editInfoBtn.addEventListener('click', () => {
    const fields = ['fullName', 'email', 'phone', 'gender', 'dob', 'membershipDate'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (fieldId === 'fullName' || fieldId === 'email' || fieldId === 'membershipDate') {
            // These are read-only, don't change
            return;
        }
        field.removeAttribute('readonly');
        field.focus();
    });

    editInfoBtn.innerHTML = '<i class="fas fa-save"></i> Save Information';
    editInfoBtn.classList.remove('btn-primary');
    editInfoBtn.classList.add('btn-success');

    editInfoBtn.onclick = () => {
        // Save information
        const updatedData = {
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            dateOfBirth: document.getElementById('dob').value
        };

        // TODO: Send updated data to backend API
        console.log('Updated user data:', updatedData);

        // Reset button
        editInfoBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Information';
        editInfoBtn.classList.add('btn-primary');
        editInfoBtn.classList.remove('btn-success');
        editInfoBtn.onclick = arguments.callee;

        alert('Information updated successfully!');
    };
});

// Save Preferences Handler
const savePreferencesBtn = document.querySelectorAll('.preferences-card .btn-small')[0];
if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener('click', () => {
        const preferences = {
            emailNewsletter: document.getElementById('emailNewsletter').checked,
            textAlerts: document.getElementById('textAlerts').checked,
            eventNotifications: document.getElementById('eventNotifications').checked
        };

        // TODO: Send preferences to backend API
        console.log('Preferences saved:', preferences);
        alert('Preferences saved successfully!');
    });
}

// Donation Buttons Handler
const donationButtons = document.querySelectorAll('.btn-donation');
donationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const donationType = btn.textContent.includes('Monthly') ? 'monthly' : 'one-time';
        
        // TODO: Redirect to payment gateway
        console.log('Initiating', donationType, 'donation');
        
        if (donationType === 'one-time') {
            alert('Redirecting to donation portal for one-time donation...');
        } else {
            alert('Redirecting to donation portal to set up monthly support...');
        }
    });
});

// Change Password Handler
const changePasswordBtn = document.querySelectorAll('.btn-small')[1];
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        const currentPassword = prompt('Enter your current password:');
        if (currentPassword) {
            const newPassword = prompt('Enter your new password:');
            if (newPassword && newPassword.length >= 8) {
                const confirmPassword = prompt('Confirm your new password:');
                if (confirmPassword === newPassword) {
                    // TODO: Send password change request to backend
                    console.log('Password change initiated');
                    alert('Password changed successfully!');
                } else {
                    alert('Passwords do not match. Please try again.');
                }
            } else {
                alert('Password must be at least 8 characters long.');
            }
        }
    });
}

// Toggle 2FA Handler
const toggle2FA = document.querySelector('.toggle-switch input[type="checkbox"]');
if (toggle2FA) {
    toggle2FA.addEventListener('change', () => {
        if (toggle2FA.checked) {
            // TODO: Implement 2FA setup
            console.log('2FA enabled');
            alert('Two-Factor Authentication has been enabled. Check your email for setup instructions.');
        } else {
            const confirm2FADisable = confirm('Are you sure you want to disable Two-Factor Authentication? This will reduce your account security.');
            if (confirm2FADisable) {
                console.log('2FA disabled');
            } else {
                toggle2FA.checked = true;
            }
        }
    });
}

// Logout Handler
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        // TODO: Send logout request to backend
        console.log('User logging out');
        
        // Clear session/auth tokens
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        
        // Redirect to home page
        window.location.href = '../Public/index.html';
    }
});

// Submit Prayer Request Handler
const submitPrayerBtn = document.querySelector('.prayer-section .btn-secondary');
if (submitPrayerBtn) {
    submitPrayerBtn.addEventListener('click', () => {
        // Redirect to prayer request page
        window.location.href = 'request.html';
    });
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadPrayerRequests();
});

// Add animation on scroll for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
