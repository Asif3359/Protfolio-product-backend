const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    heroPicture: {
      type: String,
      required: true,
    },
    heroTitle: {
      type: String,
      required: true,
    },
    heroDescription: {
      type: String,
      required: true,
    },
    bestThreeWords: [
      {
        type: String,
        required: true,
      },
    ],
    aboutMe: {
      type: String,
      required: true,
    },
    currentJobTitle: {
      type: String,
      required: true,
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      youtube: String,
    },
    contact: {
      email: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      cvLink: String,
    },
    backgroundImageForProfilePage: {
      type: String,
      required: true,
    },
    backgroundImageForExperiencePage: {
      type: String,
      required: true,
    },
    backgroundImageForProjectsPage: {
      type: String,
      required: true,
    },
    backgroundImageForSkillsPage: {
      type: String,
      required: true,
    },
    backgroundImageForEducationPage: {
      type: String,
      required: true,
    },
    backgroundImageForResearchPage: {
      type: String,
      required: true,
    },
    backgroundImageForAwardsPage: {
      type: String,
      required: true,
    },
    backgroundImageForCertificationsPage: {
      type: String,
      required: true,
    },
    ownerEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
    