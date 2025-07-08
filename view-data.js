const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Import all models
const Profile = require('./models/Profile');
const Academic = require('./models/Academic');
const Research = require('./models/Research');
const Project = require('./models/Project');
const Certification = require('./models/Certification');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Award = require('./models/Award');

async function viewAllData() {
    try {
        console.log('\n=== Profile Data ===');
        const profiles = await Profile.find({});
        console.log(JSON.stringify(profiles, null, 2));

        console.log('\n=== Academic Data ===');
        const academics = await Academic.find({});
        console.log(JSON.stringify(academics, null, 2));

        console.log('\n=== Research Data ===');
        const research = await Research.find({});
        console.log(JSON.stringify(research, null, 2));

        console.log('\n=== Project Data ===');
        const projects = await Project.find({});
        console.log(JSON.stringify(projects, null, 2));

        console.log('\n=== Certification Data ===');
        const certifications = await Certification.find({});
        console.log(JSON.stringify(certifications, null, 2));

        console.log('\n=== Skill Data ===');
        const skills = await Skill.find({});
        console.log(JSON.stringify(skills, null, 2));

        console.log('\n=== Experience Data ===');
        const experiences = await Experience.find({});
        console.log(JSON.stringify(experiences, null, 2));

        console.log('\n=== Award Data ===');
        const awards = await Award.find({});
        console.log(JSON.stringify(awards, null, 2));

    } catch (error) {
        console.error('Error viewing data:', error);
    } finally {
        mongoose.connection.close();
    }
}

viewAllData(); 