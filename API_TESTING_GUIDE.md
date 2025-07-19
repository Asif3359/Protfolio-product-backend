# Portfolio Backend API Testing Guide

This guide provides curl commands for testing all APIs in the Portfolio Backend application.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication. You'll need to:
1. Register an admin account
2. Login to get a JWT token
3. Include the token in the Authorization header for protected routes

---
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZjMmMzYjBiYjYyNzVjNmM3ZDk2OGIiLCJpYXQiOjE3NTE5MTk2NzV9.YCb56EDAFYKcgm3vnbFrsrOmF2cmIm5dkvyiu4O0_dQ

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZjMmMzYjBiYjYyNzVjNmM3ZDk2OGIiLCJpYXQiOjE3NTE5MTk3MDJ9.FUvgejHATtVZAy7N6J8YHyE8iWAGccWLQ--UeZwcn5U

## 1. Admin Authentication APIs

### Register Admin
```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mehedi.buet.me19",
    "email": "mehedi.buet.me19@gmail.com",
    "password": "me19#mehedi"
  }'
```

curl.exe -X POST http://localhost:3000/api/admin/register `
  -H "Content-Type: application/json" `
  -d '{"username": "mehedi.buet.me19", "email": "mehedi.buet.me19@gmail.com", "password": "me19#mehedi"}'

### Login Admin
```bash
curl -X POST https://protfolio-product-backend.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Admin Profile
```bash
curl -X GET http://localhost:3000/api/admin/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZjMmQ0NjBiYjYyNzVjNmM3ZDk2OTMiLCJpYXQiOjE3NTE5MjAxMjZ9.mmUfbGhtyyDZKlKmNfR5un5CfJgtSygTBLTh0WkRUU0"
```

### Update Admin Profile
```bash
curl -X PATCH http://localhost:3000/api/admin/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "newadmin",
    "email": "newadmin@example.com"
  }'
```

---

## 2. Profile APIs

### Get Profile
```bash
curl -X GET http://localhost:3000/api/profile
```

### Create/Update Profile
```bash
curl -X POST http://localhost:3000/api/profile \
  -H "Authorization: Bearer curl -X GET http://localhost:3000/api/admin/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "heroTitle=Full Stack Developer" \
  -F "heroDescription=Passionate developer with expertise in modern web technologies" \
  -F "bestThreeWords=Creative, Dedicated, Innovative" \
  -F "aboutMe=I am a full stack developer with 5+ years of experience" \
  -F "currentJobTitle=Senior Software Engineer" \
  -F "socialMedia[0][platform]=LinkedIn" \
  -F "socialMedia[0][url]=https://linkedin.com/in/username" \
  -F "contact[email]=contact@example.com" \
  -F "contact[mobile]=+1234567890" \
  -F "profilePicture=@test-profile.jpg" \
  -F "heroPicture=@test-hero.jpg"
```

### Update Profile (Partial)
```bash
curl -X PATCH http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "heroTitle=Updated Title" \
  -F "aboutMe=Updated about me section"
```

---

## 3. Experience APIs

### Get All Experiences
```bash
curl -X GET http://localhost:3000/api/experience
```

### Create Experience
```bash
curl -X POST http://localhost:3000/api/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "startDate": "2022-01-01",
    "endDate": "2023-12-31",
    "isCurrent": false,
    "description": "Led development of web applications",
    "responsibilities": ["Code review", "Mentoring", "Architecture design"],
    "achievements": ["Improved performance by 50%", "Reduced bugs by 30%"],
    "technologies": ["JavaScript", "React", "Node.js", "MongoDB"]
  }'
```

### Get Experience by ID
```bash
curl -X GET http://localhost:3000/api/experience/EXPERIENCE_ID
```

### Update Experience
```bash
curl -X PATCH http://localhost:3000/api/experience/EXPERIENCE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Lead Software Engineer",
    "description": "Updated description"
  }'
```

### Delete Experience
```bash
curl -X DELETE http://localhost:3000/api/experience/EXPERIENCE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 4. Project APIs

### Get All Projects
```bash
curl -X GET http://localhost:3000/api/project
```

### Create Project
```bash
curl -X POST http://localhost:3000/api/project \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=E-commerce Platform" \
  -F "description=A full-stack e-commerce application" \
  -F "technologies[0]=React" \
  -F "technologies[1]=Node.js" \
  -F "technologies[2]=MongoDB" \
  -F "startDate=2023-01-01" \
  -F "endDate=2023-06-30" \
  -F "link=https://project-demo.com" \
  -F "githubLink=https://github.com/username/project" \
  -F "features[0]=User authentication" \
  -F "features[1]=Payment integration" \
  -F "status=Completed" \
  -F "image=@test-project.jpg"
```

### Get Project by ID
```bash
curl -X GET http://localhost:3000/api/project/PROJECT_ID
```

### Update Project
```bash
curl -X PATCH http://localhost:3000/api/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated Project Title" \
  -F "description=Updated project description" \
  -F "image=@test-project-new.jpg"
```

### Delete Project
```bash
curl -X DELETE http://localhost:3000/api/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 5. Skill APIs

### Get All Skills
```bash
curl -X GET http://localhost:3000/api/skill
```

### Get Skills by Category
```bash
curl -X GET "http://localhost:3000/api/skill?category=Framework"
```

### Create Skill
```bash
curl -X POST http://localhost:3000/api/skill \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "React",
    "category": "Framework",
    "proficiency": 90,
    "description": "Modern JavaScript library for building user interfaces"
  }'
```

**Valid categories:** Programming, Framework, Database, Tool, Language, Design, DevOps, Cloud, Other

### Get Skill by ID
```bash
curl -X GET http://localhost:3000/api/skill/SKILL_ID
```

### Update Skill
```bash
curl -X PATCH http://localhost:3000/api/skill/SKILL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "proficiency": 95,
    "description": "Updated description"
  }'
```

### Delete Skill
```bash
curl -X DELETE http://localhost:3000/api/skill/SKILL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 6. Academic APIs

### Get All Academics
```bash
curl -X GET http://localhost:3000/api/academic
```

### Create Academic
```bash
curl -X POST http://localhost:3000/api/academic \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "degree": "Master of Science",
    "institution": "Stanford University",
    "field": "Computer Science",
    "startDate": "2020-09-01",
    "endDate": "2022-06-30",
    "description": "Specialized in artificial intelligence and machine learning",
    "achievements": ["Graduated with honors", "Published 3 research papers"],
    "gpa": 3.8
  }'
```

### Get Academic by ID
```bash
curl -X GET http://localhost:3000/api/academic/ACADEMIC_ID
```

### Update Academic
```bash
curl -X PATCH http://localhost:3000/api/academic/ACADEMIC_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "gpa": 3.9,
    "achievements": ["Graduated with honors", "Published 4 research papers"]
  }'
```

### Delete Academic
```bash
curl -X DELETE http://localhost:3000/api/academic/ACADEMIC_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 7. Certification APIs

### Get All Certifications
```bash
curl -X GET http://localhost:3000/api/certification
```

### Create Certification
```bash
curl -X POST http://localhost:3000/api/certification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "date": "2023-03-15",
    "expiryDate": "2026-03-15",
    "credentialId": "AWS-123456",
    "credentialUrl": "https://aws.amazon.com/verification",
    "description": "Professional level certification for AWS cloud architecture"
  }'
```

### Get Certification by ID
```bash
curl -X GET http://localhost:3000/api/certification/CERTIFICATION_ID
```

### Update Certification
```bash
curl -X PATCH http://localhost:3000/api/certification/CERTIFICATION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Updated certification description"
  }'
```

### Delete Certification
```bash
curl -X DELETE http://localhost:3000/api/certification/CERTIFICATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 8. Award APIs

### Get All Awards
```bash
curl -X GET http://localhost:3000/api/award
```

### Get Awards by Category
```bash
curl -X GET "http://localhost:3000/api/award?category=Academic"
```

### Create Award
```bash
curl -X POST http://localhost:3000/api/award \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Best Developer Award",
    "issuer": "Tech Conference 2023",
    "date": "2023-11-20",
    "description": "Recognized for outstanding contributions to open source projects",
    "category": "Professional",
    "link": "https://techconference.com/awards"
  }'
```

### Get Award by ID
```bash
curl -X GET http://localhost:3000/api/award/AWARD_ID
```

### Update Award
```bash
curl -X PATCH http://localhost:3000/api/award/AWARD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Updated award description"
  }'
```

### Delete Award
```bash
curl -X DELETE http://localhost:3000/api/award/AWARD_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 9. Research APIs

### Get All Research
```bash
curl -X GET http://localhost:3000/api/research
```

### Get Research by Type
```bash
curl -X GET "http://localhost:3000/api/research?type=Journal"
```

### Create Research
```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "Journal",
    "title": "Machine Learning in Web Development",
    "description": "A comprehensive study of ML applications in modern web development",
    "authors": ["John Doe", "Jane Smith"],
    "publicationDate": "2023-08-15",
    "journal": "Computer Science Review",
    "doi": "10.1234/csr.2023.001",
    "link": "https://journal.com/paper",
    "status": "Published"
  }'
```

### Get Research by ID
```bash
curl -X GET http://localhost:3000/api/research/RESEARCH_ID
```

### Update Research
```bash
curl -X PATCH http://localhost:3000/api/research/RESEARCH_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "Under Review",
    "description": "Updated research description"
  }'
```

### Delete Research
```bash
curl -X DELETE http://localhost:3000/api/research/RESEARCH_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 10. Users APIs

### Get Users
```bash
curl -X GET http://localhost:3000/api/users
```

---

## Testing Workflow

1. **Start the server** (if not already running):
   ```bash
   npm start
   ```

2. **Register an admin account** using the admin register endpoint

3. **Login to get JWT token** using the admin login endpoint

4. **Replace `YOUR_JWT_TOKEN`** in all protected routes with the actual token

5. **Test each endpoint** using the provided curl commands

6. **Replace placeholder IDs** (like `EXPERIENCE_ID`, `PROJECT_ID`, etc.) with actual IDs returned from create operations

---

## Common Issues and Solutions

### 1. Getting `null` response from GET requests
- **Cause:** No data exists in the database yet
- **Solution:** Create data first using POST requests

### 2. File upload errors
- **Cause:** File paths don't exist or are incorrect
- **Solution:** Use existing files or create test files:
  ```bash
  echo "test content" > test-profile.jpg
  echo "test content" > test-hero.jpg
  echo "test content" > test-project.jpg
  ```

### 3. Validation errors
- **Cause:** Missing required fields or invalid enum values
- **Solution:** Check the model requirements and use valid enum values

### 4. Authorization errors
- **Cause:** Invalid or expired JWT token
- **Solution:** Login again to get a fresh token

### 5. Malformed curl commands
- **Cause:** Mixed up headers or incorrect syntax
- **Solution:** Use the exact format shown in the examples

## Notes

- All file uploads use `multipart/form-data` format
- Protected routes require the `Authorization: Bearer YOUR_JWT_TOKEN` header
- Date fields should be in ISO format (YYYY-MM-DD)
- Array fields in form data should use indexed notation (e.g., `technologies[0]`, `technologies[1]`)
- The server should be running on `http://localhost:3000` (adjust if different)
- Make sure to handle the JWT token securely and don't expose it in logs or version control
- **Required fields for Profile:** `profilePicture`, `heroPicture`, `contact.mobile`
- **Valid Skill categories:** Programming, Framework, Database, Tool, Language, Design, DevOps, Cloud, Other 