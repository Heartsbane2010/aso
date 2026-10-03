// ============================================
// PROFILE PAGE FUNCTIONALITY
// ============================================

const PROFILE_IMAGE_KEY = 'asoProfileImage';
const DEFAULT_PROFILE_IMAGE = '../images/pngfind.com-placeholder-png-6104451.png';

function getAbsoluteProfileImageUrl(url) {
    if (!url) return DEFAULT_PROFILE_IMAGE;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `http://localhost:4000${url}`;
}

// Profile Picture Upload Handler
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const profilePicture = document.getElementById('profilePicture');

uploadBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fileInput.click();
});//Ties the file input to the upload button

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];//Get the first file from the input
    const maxSize = 2 * 1024 * 1024;

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }

    if (file.size > maxSize) {
        alert('File exceeds 2MB limit');
        return;
    }

    const reader = new FileReader();//Create a new FileReader instance to read the file
    reader.onload = (event) => {
        const previewUrl = event.target.result;//Get the data URL of the image
        profilePicture.src = previewUrl;//Set the profile picture to the preview URL
        console.log('Profile picture preview updated');
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('profilePicture', file);//Append the file to the FormData object

    const userId = localStorage.getItem('userId');
    if (userId) {
        formData.append('userId', userId);
    }

    try {
        const response = await fetch('http://localhost:4000/upload-profile-pic', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (!response.ok || !result.url) {
            throw new Error(result.message || 'The image upload failed.');
        }

        const uploadedImageUrl = getAbsoluteProfileImageUrl(result.url);

        profilePicture.src = uploadedImageUrl;
        localStorage.setItem(PROFILE_IMAGE_KEY, uploadedImageUrl);
        console.log('Upload successful:', result);
    } catch (err) {
        console.error('Error uploading profile picture:', err);
    }
});

//Helper function to format date string to YYYY-MM-DD format for HTML5 date input.
const formatDateForInput = (dateString) => {
    if (!dateString) return '';//Guard against missing data
    try {
        // Create a new Date object from the provided date string(text)
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';//Check if the date is valid
        return date.toISOString().split('T')[0];//Convert to ISO string and extract the date part (YYYY-MM-DD)
    } catch (err) {
        console.error('Error formatting date:', err);
        return '';
    }
};

// Load User Data from Database
const loadUserProfile = async () => {
    try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        if (!token) {
            console.warn('No active user session found. Please log in to view your profile.');
            window.location.href = '../Public/membership.html'; // Redirect to login page if no userId is found
            return;
        }
        const response = await fetch('http://localhost:4000/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch user profile: ${response.statusText}(${response.status})`);
        }
        const userData = await response.json();

        document.getElementById('userName').innerHTML = 
            `<span class="welcome-greeting"></span><span class="user-name">${userData.firstName} ${userData.lastName}</span>`;

        document.getElementById('firstName').value = userData.firstName;
        document.getElementById('lastName').value = userData.lastName;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('gender').value = userData.gender;
        document.getElementById('dob').value = formatDateForInput(userData.dateOfBirth);
        document.getElementById('membershipDate').value = formatDateForInput(userData.membershipDate);
        document.getElementById('churchRole').value = userData.churchInvolvement;
        document.getElementById('profilePicture').src = userData.profilePicture;
    }   catch (error) {
        console.error('Error loading user profile:', error);
}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserProfile);
} else {
    loadUserProfile();
}

const loadPrayerRequests = async () => {
    try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        if (!token) {
            console.warn('No active user session found. Please log in to view your prayer requests.');
            window.location.href = '../Public/membership.html'; 
            return;
        }
        const response = await fetch('http://localhost:4000/prayer-request', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401 || response.status === 403) {
            console.warn('Unauthorized access to prayer requests.');
            window.location.href = '../Public/membership.html';
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch prayer requests: ${response.statusText}(${response.status})`);
        }
        const prayerRequest = await response.json();
        //Clear the HTML container for prayer requests before populating it with new data
        const prayerRequestsContainer = document.getElementById('prayerRequestsContainer');
        prayerRequestsContainer.innerHTML = '';

        if (prayerRequest.length === 0) {
            prayerRequestsContainer.innerHTML = '<p>No prayer requests found.</p>';
            return;
        }

        //Loop through each prayer request and create HTML elements to display them
        prayerRequest.forEach((request, index) => {
            //Format the database timestamp into a more readable format
            const formattedDate = new Date(request.timestamp).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
        }).replace(', ', ' at '); 
            const prayerRequestItem = document.createElement('div');
            prayerRequestItem.className = 'prayer-request-item';
            prayerRequestItem.innerHTML = `
                <h3 class="prayer-title">${escapeHTML(request.title)}</h3>
                <p class="prayer-content">${escapeHTML(request.request)}</p>
                <time class="prayer-timestamp"><i class="fas fa-calendar-alt"></i>${formattedDate}</time>
            `;
            prayerRequestsContainer.appendChild(prayerRequestItem);

            //Create and append a horizontal rule if this is not the last prayer request in the list(array)
            if (index < prayerRequest.length - 1) {
                const divider = document.createElement('hr');
                divider.className = 'prayer-divider';
                prayerRequestsContainer.appendChild(divider);
            }
        });
    } catch (error) {
        console.error('Error loading prayer requests:', error);
    }
};

// Security Helper: Prevents malicious code injection (XSS) if users type HTML tags in their requests
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPrayerRequests);
} else {
    loadPrayerRequests();
}

// Submit Prayer Request Handler
const submitPrayerBtn = document.querySelector('.prayer-section .btn-secondary');
if (submitPrayerBtn) {
    submitPrayerBtn.addEventListener('click', () => {
        window.location.href = 'request.html';
    });
}


//Keep Track of our current form state
let isEditing = false;
const editInfoBtn = document.getElementById('editInfoBtn');

editInfoBtn.addEventListener('click', async () => {
    //Array of fields that can be edited
    const editableFields = ['phone', 'gender', 'dob', 'churchRole', 'membershipDate'];

    if (!isEditing) {
        // Switch to edit mode
        editableFields.forEach(fieldId => {//We loop through each field and make it editable
            const field = document.getElementById(fieldId);
            if (field) {
                field.removeAttribute('readonly');
                field.classList.add('editable');
            }
        });

        //Focus on the first editable field
        document.getElementById(editableFields[0])?.focus();

        //Update button text to indicate save action
        editInfoBtn.innerHTML = '<i class="fas fa-save"></i> Save Information';
        editInfoBtn.classList.remove('btn-primary');
        editInfoBtn.classList.add('btn-success');

        //Flip the state to indicate we are now in edit mode
        isEditing = true;
    } else {
        // -- SAVE DATA AND SWITCH BACK TO VIEW MODE --

        //Gather values from the DOM
        const updatedData = {
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            dateOfBirth: document.getElementById('dob').value,
            churchInvolvement: document.getElementById('churchRole').value,
            membershipDate: document.getElementById('membershipDate').value
        };

        //Send updated data to backend API
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            const response = await fetch('http://localhost:4000/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save updated information');
            }
            const result = await response.json();
            alert('Information updated successfully!');
            console.log('Updated user data:', result);
            console.log('Target userId:', userId);

            //Lock the fields again and switch back to view mode
            editableFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.setAttribute('readonly', true);
                    field.classList.remove('editable');
                }
            });

            //Reset button text and style
            isEditing = false;
            editInfoBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Information';
            editInfoBtn.classList.add('btn-primary');
            editInfoBtn.classList.remove('btn-success');
        } catch (error) {
            console.error('Error saving updated information:', error);
        }
    }
});

//Save Preferences Handler
const savePreferencesBtn = document.querySelectorAll('.preferences-card .btn-small')[0];
savePreferencesBtn.addEventListener('click', async () => {
    const preferences = {
        emailNewsletter: document.getElementById('emailNewsletter').checked,
        textAlerts: document.getElementById('textAlerts').checked,
        eventNotifications: document.getElementById('eventNotifications').checked
    };

    try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        const response = await fetch('http://localhost:4000/email-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(preferences)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save preferences');
        }
        const result = await response.json();
        alert(result.message || 'Preferences saved successfully!');
        console.log('Preferences saved:', result);
    } catch (error) {
        console.error('Error saving preferences:', error);
        alert('Failed to save preferences. Please try again later.');
    }
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

//Handle Logout
const logoutUser = async () => {
    try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        if (!token) {
            console.warn('No active user session found.');
            return;
        }

        const response = await fetch('http://localhost:4000/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            credentials: 'include' // Include cookies in the request
        });

        if (response.status === 204) {
            // Clear local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');

            console.log('Logged out successfully!');
            window.location.href = '../Public/membership.html'; // Redirect to login page after logout
        } else {
            const errorData = await response.json();
            console.error('Logout failed:', errorData.message);
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

document.getElementById('logoutBtn').addEventListener('click', (event) => {
    event.preventDefault();
    logoutUser();
});