const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../cloudinary"); // adjust path as needed

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

function extractArray(field, body) {
  const keys = Object.keys(body).filter(key => key.startsWith(field + "["));
  let arr = [];
  if (keys.length === 0 && body[field]) {
    arr = [body[field]];
  } else {
    arr = keys
      .sort()
      .map(key => body[key])
      .filter(Boolean);
  }
  // Flatten and parse any stringified arrays
  arr = arr.flatMap(item => {
    if (typeof item === "string" && item.startsWith("[") && item.endsWith("]")) {
      try {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : [item];
      } catch {
        return [item];
      }
    }
    return [item];
  });
  // FINAL FLATTEN: If the result is [["a","b"]], flatten to ["a","b"]
  return arr.flat();
}

// Configure multer for project image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create experience
router.post("/", auth, upload.array("images"), async (req, res) => {
  try {
    const experience = new Experience(req.body);
    if (req.files) {
      experience.images = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, "experience");
        experience.images.push(url);
      }
    }
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get experience by id
router.get("/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Update experience
// router.patch("/:id", auth, upload.array("images"), async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = [
//     "title",
//     "company",
//     "location",
//     "startDate",
//     "endDate",
//     "isCurrent",
//     "description",
//     "responsibilities",
//     "achievements",
//     "technologies",
//   ];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).json({ error: "Invalid updates!" });
//   }

//   try {
//     const experience = await Experience.findById(req.params.id);
//     if (!experience) {
//       return res.status(404).json({ error: "Experience not found" });
//     }

//     if (req.files) {
//       experience.images = [];
//       for (const file of req.files) {
//         const url = await uploadToCloudinary(file.buffer, "experience");
//         experience.images.push(url);
//       }
//     }

//     updates.forEach((update) => (experience[update] = req.body[update]));
//     await experience.save();
//     res.json(experience);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Helper to ensure arrays are always arrays of strings
function ensureArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return [val];
    }
  }
  if (val !== undefined && val !== null) return [val];
  return [];
}

// router.put("/:id", auth, upload.array("images"), async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     // Defensive: Always ensure arrays
//     updateData.responsibilities = ensureArray(updateData.responsibilities);
//     updateData.achievements = ensureArray(updateData.achievements);
//     updateData.technologies = ensureArray(updateData.technologies);

//     // Defensive: Convert dates
//     if (updateData.startDate)
//       updateData.startDate = new Date(updateData.startDate);
//     if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

//     // Defensive: Check required fields
//     const requiredFields = [
//       "title",
//       "company",
//       "startDate",
//       "description",
//       "ownerEmail",
//     ];
//     for (const field of requiredFields) {
//       if (
//         updateData[field] === undefined ||
//         updateData[field] === "" ||
//         (Array.isArray(updateData[field]) && updateData[field].length === 0)
//       ) {
//         return res.status(400).json({ error: `Field '${field}' is required.` });
//       }
//     }

//     if (req.files) {
//       updateData.images = [];
//       for (const file of req.files) {
//         const url = await uploadToCloudinary(file.buffer, "experience");
//         updateData.images.push(url);
//       }
//     }

//     const experience = await Experience.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );
//     if (!experience) {
//       return res.status(404).json({ error: "Experience not found" });
//     }
//     res.json(experience);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Delete experience


// Update Experience with PUT - FIXED VERSION (Handles both adding and removing images)
// Update Experience with PUT - DEBUG VERSION
router.put("/:id", auth, upload.array("images"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    // DEBUG: Log all incoming data
    console.log('=== DEBUG: Incoming Request Data ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('req.params.id:', req.params.id);

    // Defensive: Always extract arrays, even if only one value
    updateData.responsibilities = extractArray('responsibilities', req.body);
    updateData.achievements = extractArray('achievements', req.body);
    updateData.technologies = extractArray('technologies', req.body);

    // Defensive: Remove empty string from arrays (from default [""] in frontend)
    updateData.responsibilities = updateData.responsibilities.filter(Boolean);
    updateData.achievements = updateData.achievements.filter(Boolean);
    updateData.technologies = updateData.technologies.filter(Boolean);

    // Defensive: Convert dates, but only if valid
    if (updateData.startDate) {
      const d = new Date(updateData.startDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: 'Invalid startDate.' });
      }
      updateData.startDate = d;
    }
    if (updateData.endDate) {
      const d = new Date(updateData.endDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: 'Invalid endDate.' });
      }
      updateData.endDate = d;
    }

    // Defensive: Check required fields
    const requiredFields = [
      "title",
      "company",
      "startDate",
      "description",
      "ownerEmail",
    ];
    for (const field of requiredFields) {
      if (
        updateData[field] === undefined ||
        updateData[field] === "" ||
        (Array.isArray(updateData[field]) && updateData[field].length === 0)
      ) {
        return res.status(400).json({ error: `Field '${field}' is required.` });
      }
    }

    // DEBUG: Get existing experience
    const existingExperience = await Experience.findById(req.params.id);
    if (!existingExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    console.log('=== DEBUG: Existing Experience ===');
    console.log('Existing images:', existingExperience.images);

    // Get the current image state from frontend (this includes existing images after user's removals)
    const currentImages = extractArray('currentImages', req.body) || [];
    
    console.log('=== DEBUG: Image Processing ===');
    console.log('currentImages from frontend:', currentImages);
    console.log('currentImages length:', currentImages.length);
    
    // Start with ONLY the current images from frontend (no database preservation)
    updateData.images = [...currentImages];

    // Add any new images if uploaded
    if (req.files && req.files.length > 0) {
      console.log('Processing new files:', req.files.length);
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'experience_images');
        updateData.images.push(url);
        console.log('Uploaded new image:', url);
      }
    }

    console.log('=== DEBUG: Final Image State ===');
    console.log('Final updateData.images:', updateData.images);
    console.log('Final image count:', updateData.images.length);

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    console.log('=== DEBUG: Updated Experience ===');
    console.log('Updated experience images:', experience.images);

    res.json(experience);
  } catch (error) {
    // Log the error for debugging
    console.error('PUT /experience/:id error:', error);
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
