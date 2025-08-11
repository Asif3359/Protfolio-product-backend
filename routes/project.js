const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinary'); // adjust path as needed

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

// Configure multer for project image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ startDate: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create project
// Create project - FIXED VERSION
router.post('/', auth, upload.array('images'), async (req, res) => {
  try {
      const projectData = { ...req.body };
      console.log('Project Data:', projectData);
      console.log('Files:', req.files);
      
      // FIXED: Check for req.files (plural) not req.file (singular)
      if (req.files && req.files.length > 0) {
          projectData.images = [];
          for (const file of req.files) {
              const url = await uploadToCloudinary(file.buffer, 'project_images');
              projectData.images.push(url);
          }
          console.log('Uploaded images:', projectData.images);
      } else {
          projectData.images = []; // Initialize empty array if no images
      }
      
      const project = new Project(projectData);
      await project.save();
      res.status(201).json(project);
  } catch (error) {
      console.error('POST /project error:', error);
      res.status(400).json({ error: error.message });
  }
});

// Get project by id
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update project// 
// Helper to extract array fields from req.body
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
  
  router.patch('/:id', auth, upload.array('images'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title', 'description', 'technologies', 'startDate',
      'endDate', 'link', 'githubLink', 'features', 'status'
    ];
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update) ||
      allowedUpdates.some(field => update.startsWith(field + "["))
    );
  
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }
  
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      if (req.files) {
        project.images = [];
        for (const file of req.files) {
            const url = await uploadToCloudinary(file.buffer, 'project_images');
            project.images.push(url);
        }
      }
  
      // Set normal fields, with type conversion
      allowedUpdates.forEach(update => {
        if (update === 'technologies' || update === 'features') return;
        if (req.body[update] !== undefined) {
          if (update === 'startDate' || update === 'endDate') {
            project[update] = req.body[update] ? new Date(req.body[update]) : undefined;
          } else {
            project[update] = req.body[update];
          }
        }
      });
  
      // Set array fields
      project.technologies = extractArray('technologies', req.body);
      project.features = extractArray('features', req.body);
  
      await project.save();
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update sue Project with PUT
  // router.put('/:id', auth, upload.array('images'), async (req, res) => {
  //   try {
  //     const updateData = { ...req.body };
  
  //     // Defensive: Always extract arrays, even if only one value
  //     updateData.technologies = extractArray('technologies', req.body);
  //     updateData.features = extractArray('features', req.body);
  
  //     // Defensive: Remove empty string from arrays (from default [""] in frontend)
  //     updateData.technologies = updateData.technologies.filter(Boolean);
  //     updateData.features = updateData.features.filter(Boolean);
  
  //     // Defensive: Convert dates, but only if valid
  //     if (updateData.startDate) {
  //       const d = new Date(updateData.startDate);
  //       if (isNaN(d.getTime())) {
  //         return res.status(400).json({ error: 'Invalid startDate.' });
  //       }
  //       updateData.startDate = d;
  //     }
  //     if (updateData.endDate) {
  //       const d = new Date(updateData.endDate);
  //       if (isNaN(d.getTime())) {
  //         return res.status(400).json({ error: 'Invalid endDate.' });
  //       }
  //       updateData.endDate = d;
  //     }
  
  //     // Defensive: Check required fields
  //     const requiredFields = ['title', 'description', 'technologies', 'startDate', 'ownerEmail'];
  //     for (const field of requiredFields) {
  //       if (
  //         updateData[field] === undefined ||
  //         updateData[field] === "" ||
  //         (Array.isArray(updateData[field]) && updateData[field].length === 0)
  //       ) {
  //         return res.status(400).json({ error: `Field '${field}' is required.` });
  //       }
  //     }
  
  //     // Defensive: Check status enum
  //     const allowedStatus = ['In Progress', 'Completed', 'On Hold'];
  //     if (updateData.status && !allowedStatus.includes(updateData.status)) {
  //       return res.status(400).json({ error: 'Invalid status value.' });
  //     }
  
  //     if (req.files) {
  //       updateData.images = [];
  //       for (const file of req.files) {
  //           const url = await uploadToCloudinary(file.buffer, 'project_images');
  //           updateData.images.push(url);
  //       }
  //     }
  
  //     const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  //     if (!project) {
  //       return res.status(404).json({ error: 'Project not found' });
  //     }
  //     res.json(project);
  //   } catch (error) {
  //     // Log the error for debugging
  //     console.error('PUT /project/:id error:', error);
  //     res.status(400).json({ error: error.message });
  //   }
  // });


// Update Project with PUT - FIXED VERSION
// router.put('/:id', auth, upload.array('images'), async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     // Defensive: Always extract arrays, even if only one value
//     updateData.technologies = extractArray('technologies', req.body);
//     updateData.features = extractArray('features', req.body);

//     // Defensive: Remove empty string from arrays (from default [""] in frontend)
//     updateData.technologies = updateData.technologies.filter(Boolean);
//     updateData.features = updateData.features.filter(Boolean);

//     // Defensive: Convert dates, but only if valid
//     if (updateData.startDate) {
//       const d = new Date(updateData.startDate);
//       if (isNaN(d.getTime())) {
//         return res.status(400).json({ error: 'Invalid startDate.' });
//       }
//       updateData.startDate = d;
//     }
//     if (updateData.endDate) {
//       const d = new Date(updateData.endDate);
//       if (isNaN(d.getTime())) {
//         return res.status(400).json({ error: 'Invalid endDate.' });
//       }
//       updateData.endDate = d;
//     }

//     // Defensive: Check required fields
//     const requiredFields = ['title', 'description', 'technologies', 'startDate', 'ownerEmail'];
//     for (const field of requiredFields) {
//       if (
//         updateData[field] === undefined ||
//         updateData[field] === "" ||
//         (Array.isArray(updateData[field]) && updateData[field].length === 0)
//       ) {
//         return res.status(400).json({ error: `Field '${field}' is required.` });
//       }
//     }

//     // Defensive: Check status enum
//     const allowedStatus = ['In Progress', 'Completed', 'On Hold'];
//     if (updateData.status && !allowedStatus.includes(updateData.status)) {
//       return res.status(400).json({ error: 'Invalid status value.' });
//     }

//     // FIXED: Handle images properly - preserve existing + add new
//     if (req.files && req.files.length > 0) {
//       // Get existing project to preserve current images
//       const existingProject = await Project.findById(req.params.id);
//       if (!existingProject) {
//         return res.status(404).json({ error: 'Project not found' });
//       }

//       // Start with existing images
//       updateData.images = [...(existingProject.images || [])];

//       // Add new images
//       for (const file of req.files) {
//         const url = await uploadToCloudinary(file.buffer, 'project_images');
//         updateData.images.push(url);
//       }
//     }

//     const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found' });
//     }
//     res.json(project);
//   } catch (error) {
//     // Log the error for debugging
//     console.error('PUT /project/:id error:', error);
//     res.status(400).json({ error: error.message });
//   }
// });

// Update Project with PUT - UPDATED VERSION (Handles both adding and removing images)
// Update Project with PUT - FIXED VERSION (No duplicate images)
router.put('/:id', auth, upload.array('images'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Defensive: Always extract arrays, even if only one value
    updateData.technologies = extractArray('technologies', req.body);
    updateData.features = extractArray('features', req.body);

    // Defensive: Remove empty string from arrays (from default [""] in frontend)
    updateData.technologies = updateData.technologies.filter(Boolean);
    updateData.features = updateData.features.filter(Boolean);

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
    const requiredFields = ['title', 'description', 'technologies', 'startDate', 'ownerEmail'];
    for (const field of requiredFields) {
      if (
        updateData[field] === undefined ||
        updateData[field] === "" ||
        (Array.isArray(updateData[field]) && updateData[field].length === 0)
      ) {
        return res.status(400).json({ error: `Field '${field}' is required.` });
      }
    }

    // Defensive: Check status enum
    const allowedStatus = ['In Progress', 'Completed', 'On Hold'];
    if (updateData.status && !allowedStatus.includes(updateData.status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    // FIXED: Handle images properly - NO DUPLICATES
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get the current image state from frontend (this includes existing images after user's removals)
    const currentImages = extractArray('currentImages', req.body) || [];
    
    // Start with ONLY the current images from frontend (no database preservation)
    updateData.images = [...currentImages];

    // Add any new images if uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'project_images');
        updateData.images.push(url);
      }
    }

    console.log('Image Update Debug:', {
      currentImagesFromFrontend: currentImages.length,
      newFiles: req.files ? req.files.length : 0,
      finalImageCount: updateData.images.length,
      currentImages: currentImages,
      finalImages: updateData.images
    });

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    // Log the error for debugging
    console.error('PUT /project/:id error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;