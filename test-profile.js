const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODMwZTBjMjZkNDA0Y2Y1ZTliNzcxOTMiLCJpYXQiOjE3NDgwMzM3MzB9.SVDd5Syst1OBhrWswf6VPDntUVjrSesxLHs9aYo7cNs';

async function testProfileCreation() {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('heroTitle', 'Full Stack Developer');
        formData.append('heroDescription', 'Passionate about creating amazing web applications');
        formData.append('bestThreeWords', JSON.stringify(['Creative', 'Dedicated', 'Innovative']));
        formData.append('aboutMe', 'I am a full stack developer with experience in various technologies');
        formData.append('currentJobTitle', 'Senior Developer');
        
        // Add social media as individual fields
        formData.append('socialMedia[facebook]', 'https://facebook.com/profile');
        formData.append('socialMedia[twitter]', 'https://twitter.com/profile');
        formData.append('socialMedia[linkedin]', 'https://linkedin.com/in/profile');
        formData.append('socialMedia[youtube]', 'https://youtube.com/channel');
        
        // Add contact information
        formData.append('contact[email]', 'contact@example.com');
        formData.append('contact[mobile]', '+1234567890');
        formData.append('contact[cvLink]', 'https://example.com/cv.pdf');

        // Add image files
        const profilePicturePath = path.join(__dirname, 'test-profile.jpg');
        const heroPicturePath = path.join(__dirname, 'test-hero.jpg');

        if (!fs.existsSync(profilePicturePath)) {
            throw new Error('test-profile.jpg not found');
        }
        if (!fs.existsSync(heroPicturePath)) {
            throw new Error('test-hero.jpg not found');
        }

        formData.append('profilePicture', fs.createReadStream(profilePicturePath));
        formData.append('heroPicture', fs.createReadStream(heroPicturePath));

        const response = await axios.post(`${API_URL}/profile`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${TOKEN}`
            }
        });

        console.log('Profile created successfully:', response.data);
    } catch (error) {
        console.error('Error creating profile:', error.response?.data || error.message);
    }
}

testProfileCreation(); 