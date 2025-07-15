# CSV Upload Guide for Practice and Mock Questions

This document explains the required and optional fields for uploading practice and mock questions via CSV, and provides tips to ensure a smooth upload process.

---

## 📋 **Required Columns (Practice & Mock)**

| Column      | Description                                      | Required for | Example                |
|-------------|--------------------------------------------------|--------------|------------------------|
| id          | Unique question ID                               | Both         | Q1, M1                 |
| question    | The question text                                | Both         | What is 2+2?           |
| option1     | First option                                     | Both         | 1                      |
| option2     | Second option                                    | Both         | 2                      |
| option3     | Third option                                     | Both         | 3                      |
| option4     | Fourth option                                    | Both         | 4                      |
| answerIndex | Index of correct answer (0-based: 0,1,2,3)       | Both         | 3                      |
| exam        | Exam code or name                                | Both         | CAT, XAT, NMAT         |
| topics      | Comma-separated list of topics                   | Both         | Arithmetic,Algebra     |
| type        | 'practice' or 'mock'                             | Both         | practice               |
| level       | Difficulty level (easy, medium, hard, other)     | Both         | easy                   |

---

## 📝 **Additional Required for Mocks**

| Column    | Description                        | Example   |
|-----------|------------------------------------|-----------|
| day       | Day number of the mock             | 1         |
| section   | Section name (e.g., QA, VARC)      | QA        |
| mock_code | Code or name of the mock test      | CAT-M1    |

---

## 🟢 **Optional Columns**

| Column      | Description                       |
|-------------|-----------------------------------|
| explanation | Explanation for the answer        |
| chapter     | Chapter name                      |
| para        | Passage text (if any)             |
| img         | Image file name or URL            |
| video       | Video file name                   |
| videoUrl    | Video URL                         |
| videoStart  | Video start time (seconds)        |

---

## ⚠️ **Tips & Best Practices**

- **Unique IDs:** Ensure each question has a unique `id`.
- **Options:** Fill all four option columns (`option1`–`option4`).
- **answerIndex:** Use 0 for the first option, 1 for the second, etc.
- **Topics:** At least one topic is required. Use commas for multiple topics.
- **Type:** Use 'practice' for practice questions, 'mock' for mock questions.
- **Section:** Required for mocks, optional for practice.
- **mock_code:** Required for mocks to link questions to a specific mock test.
- **Level:** Use for organizing and filtering questions in the app.
- **No formulas or merged cells:** Keep the CSV plain and simple.
- **UTF-8 encoding:** Save your CSV as UTF-8 for best compatibility.

---

## 🚀 **Upload Process**
1. Prepare your CSV using the sample templates.
2. Double-check required fields are filled.
3. Upload via the admin panel.
4. Check the server logs for success or error messages.

---

## 📂 **Sample Files**
- `sample-practice-questions.csv` — For practice questions
- `sample-mock-questions-upload-template.csv` — For mock questions

If you have any questions or need more columns, contact the dev team! 