const express = require("express");
const axios = require("axios");
require("dotenv").config();
console.log("TOGETHER_API_KEY:", process.env.TOGETHER_API_KEY); // Debug: Should print the key (remove in prod)
const syllabus = require('../syllabus'); // Adjust path as needed
const { jsonrepair } = require('jsonrepair');
const stringSimilarity = require('string-similarity');
const Fuse = require('fuse.js');

const router = express.Router();

router.post("/custom-generate", async (req, res) => {
  // Input validation
  const { topic, difficulty, numberOfQuestions, mode } = req.body;
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'topic' field." });
  }
  if (!difficulty || typeof difficulty !== 'string' || !difficulty.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'difficulty' field." });
  }
  if (!numberOfQuestions || typeof numberOfQuestions !== 'number' || numberOfQuestions < 1 || numberOfQuestions > 100) {
    return res.status(400).json({ error: "Missing or invalid 'numberOfQuestions' field (must be 1-100)." });
  }

  // Final Ordered freeModels (for question generation)
  const freeModels = [
    // Top performers for JSON and comprehension
    "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",      // ✅ Best JSON reliability and comprehension
    "Qwen/Qwen1.5-72B-Chat-Free",                        // ✅ Smart and interprets loose prompts decently
    "mistralai/Mixtral-8x7B-Instruct-Free",              // ✅ Fast, good fallback

    // Newly added but promising free models
    "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",    // 🔄 Experimental but LLaMA-based
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",           // 🔄 Smaller but quick
    "meta-llama/Llama-4-Maverick-17B-128E",              // 🔄 New Llama 4-based

    // Mid-performers
    "Qwen/Qwen2.5-32B",                                  // 🟡 OK-ish for long text
    "Qwen/Qwen2.5-7B-Instruct",                          // 🟡 Lightweight, decent fallback
    "lgai/exaone-deep-32b",                              // 🟡 Occasionally unstable
    "google/gemma-7b-it",                                // 🟡 Needs strict prompts
    "togethercomputer/StripedHyena-Nous-7B",             // 🟡 Often verbose but helpful

    // Lower performers / backup only
    "mistralai/Mistral-7B-Instruct-v0.3",                // ⚠️ Prone to invalid JSON
    "arcee-ai/AFM-4.5B-Preview",                         // ⚠️ Small and weak for comprehension
    "meta-llama/Llama-Vision-Free",                      // ⚠️ Vision model, not ideal for text
    "nim/nvidia/llama-3.3-nemotron-super-49b-v1"         // ⚠️ Experimental, unstable outputs
  ];

  // Final Ordered classifierModels (for category/topic inference)
  const classifierModels = [
    // Most reliable
    "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",      // ✅ Best for semantic understanding
    "Qwen/Qwen1.5-72B-Chat-Free",                        // ✅ Natural language understanding
    "mistralai/Mixtral-8x7B-Instruct-Free",              // ✅ Decent at structure

    // Secondary (rotating) classifiers
    "meta-llama/Llama-3-8B-Instruct-v2",                 // 🔄 Smaller but fast
    "Qwen/Qwen1.5-14B-Chat",                             // 🔄 Classifier, limited context
    "mistralai/Mistral-7B-Instruct-v0.3",                // 🟡 Fails with vague prompts
    "google/gemma-7b-it",                                // 🟡 Needs clean questions
    "togethercomputer/StripedHyena-Nous-7B"              // 🟡 Risky but sometimes works
  ];
  let currentModelIndex = 0;

  // Calculate passages and questions per passage
  const questionsPerPassage = 5;
  const passagesNeeded = Math.ceil(numberOfQuestions / questionsPerPassage);
  const seed = Math.floor(Math.random() * 100000);

  // --- Comprehensive topic mapping for all major MBA exams ---
  const topicCategories = {
    quants: [
      "algebra", "arithmetic", "number system", "geometry", "mensuration", "trigonometry", "coordinate geometry",
      "logarithms", "surds and indices", "inequalities", "quadratic equations", "linear equations", "time speed distance",
      "time and work", "simple interest", "compound interest", "profit and loss", "percentages", "ratio proportion",
      "mixtures and alligations", "averages", "probability", "permutation combination", "set theory", "functions",
      "progressions", "data interpretation", "modulus", "polynomials", "series", "venn diagrams", "modern math"
    ],
    lrdi: [
      "arrangement", "circular arrangement", "linear arrangement", "puzzles", "grouping", "team formation",
      "seating arrangement", "venn diagrams", "bar graph", "line graph", "pie chart", "caselet", "tables",
      "games and tournaments", "binary logic", "calendar", "clocks", "cubes and dice", "directions", "blood relations",
      "sudoku", "distribution", "selection", "network flow", "data sufficiency", "data structures", "sets", "caselets"
    ],
    varc: [
      "reading comprehension", "para summary", "para completion", "para jumble", "odd one out", "sentence correction",
      "vocabulary", "fill in the blanks", "grammar", "sentence rearrangement", "verbal logic", "verbal reasoning",
      "analogies", "antonyms", "idioms", "jumbled paragraphs", "sentence completion", "one word substitution",
      "parts of speech", "preposition", "clauses", "modifiers", "tenses", "articles"
    ],
    gk: [
      "current affairs", "static gk", "history", "geography", "economy", "science", "sports", "politics", "awards",
      "important days", "books and authors", "inventions", "technology", "culture", "art", "international organizations"
    ]
  };

  function getCategoryFromTopic(userTopic) {
    const topic = userTopic.toLowerCase();
    for (const [category, subtopics] of Object.entries(topicCategories)) {
      if (subtopics.some(sub => topic.includes(sub))) {
        return category;
      }
    }
    return null; // fallback to LLM if not matched
  }

  function getPromptTemplate(category, topic, difficulty, numberOfQuestions, seed) {
    switch (category) {
      case "quants":
        return `You are a quiz generator for an ed-tech app. Generate ${numberOfQuestions} unique quantitative aptitude MCQs (topic: "${topic}", difficulty: ${difficulty}). Each question should have 4 options (A-D), the correct answer, and a 1–2 sentence explanation. Use random seed: ${seed} for variety. Output strict JSON: { "questions": [ ... ] }`;
      case "varc":
        return `You are a quiz generator for an ed-tech app. Generate a reading comprehension passage (150–200 words) on "${topic}" at ${difficulty} level, and ${numberOfQuestions} MCQs based on it. Each question should have 4 options (A-D), the correct answer, and a 1–2 sentence explanation. Use random seed: ${seed} for variety. Output strict JSON: { "passages": [ { "passage": "...", "questions": [ ... ] } ] }`;
      case "lrdi":
        return `You are a quiz generator for an ed-tech app. Generate a logical reasoning/data interpretation scenario (table, chart, or description) on "${topic}" at ${difficulty} level, and ${numberOfQuestions} MCQs based on it. Each question should have 4 options (A-D), the correct answer, and a 1–2 sentence explanation. Use random seed: ${seed} for variety. Output strict JSON: { "scenario": "...", "questions": [ ... ] }`;
      case "gk":
        return `You are a quiz generator for an ed-tech app. Generate ${numberOfQuestions} unique general knowledge MCQs (topic: "${topic}", difficulty: ${difficulty}). Each question should have 4 options (A-D), the correct answer, and a 1–2 sentence explanation. Use random seed: ${seed} for variety. Output strict JSON: { "questions": [ ... ] }`;
      default:
        return `You are a quiz generator for an ed-tech app. Generate ${numberOfQuestions} unique MCQs (topic: "${topic}", difficulty: ${difficulty}). Each question should have 4 options (A-D), the correct answer, and a 1–2 sentence explanation. Use random seed: ${seed} for variety. Output strict JSON: { "questions": [ ... ] }`;
    }
  }

  function extractJsonFromResponse(rawText) {
    try {
      let cleanText = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```/g, "")
        .trim();
      cleanText = jsonrepair(cleanText);
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("❌ Failed to parse JSON:", error);
      return null;
    }
  }

  async function callTogetherClassifier(userTopic, userDifficulty, userNumberOfQuestions) {
    // Use the classifierModels list for classification, rotating on failure
    const classifierPrompt = `You're an intelligent assistant that helps classify a quiz request into one of these four types:

1. Quant (math, arithmetic, algebra, geometry)
2. VARC (reading comprehension, verbal ability)
3. LRDI (logical reasoning or data interpretation)
4. GK (general knowledge: static or current affairs)

Given a user request, respond with the quiz type only. For example:
- "Give me 5 hard CAT-level questions on speed time distance" → Quant
- "Give me a short passage with questions" → VARC
- "Give me a data interpretation puzzle with table" → LRDI
- "Give me 10 questions on Indian history" → GK

Respond with just one word: Quant, VARC, LRDI, or GK.`;
    const userRequest = `Topic: ${userTopic}\nDifficulty: ${userDifficulty}\nNumber of Questions: ${userNumberOfQuestions}`;
    let lastError;
    for (let i = 0; i < classifierModels.length; i++) {
      try {
        const response = await axios.post(
          "https://api.together.xyz/v1/chat/completions",
          {
            model: classifierModels[i],
            messages: [
              { role: "system", content: classifierPrompt },
              { role: "user", content: userRequest }
            ],
            temperature: 0.0
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.choices[0].message.content.trim();
      } catch (err) {
        lastError = err;
        // Try next model
      }
    }
    // If all models fail, throw the last error
    throw lastError;
  }

  function getPromptByType(type) {
    if (type === "VARC") {
      if (numberOfQuestions >= questionsPerPassage) {
        return `
You are a quiz generator for an ed-tech app. Based on a given topic and difficulty, generate:
- ${passagesNeeded} unique reading comprehension passages (150–200 words each) on the topic: "${topic}" at ${difficulty} level
- For each passage, generate exactly ${questionsPerPassage} MCQs with options A-D
- Include the correct answer key and a 1–2 sentence explanation for each question
Use random seed: ${seed} to ensure variety. 
Do not repeat passages or questions from previous generations. 
Make each passage and question fresh, never-before-seen, and use varied explanation styles.
Output format (strict JSON only, no markdown, no comments):
{
  "passages": [
    {
      "passage": "...",
      "questions": [
        {
          "question": "...",
          "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
          "correct": "B",
          "explanation": "..."
        },
        ...
      ]
    },
    ...
  ]
}
Do NOT merge all questions under one passage. Each passage should have exactly ${questionsPerPassage} relevant questions.`;
      } else {
        return `
You are a quiz generator for an ed-tech app. Based on a given topic and difficulty, generate:
- 1 unique reading comprehension passage (150–200 words) on the topic: "${topic}" at ${difficulty} level
- For the passage, generate exactly ${numberOfQuestions} MCQs with options A-D
- Include the correct answer key and a 1–2 sentence explanation for each question
Use random seed: ${seed} to ensure variety. 
Do not repeat passages or questions from previous generations. 
Make each passage and question fresh, never-before-seen, and use varied explanation styles.
Output format (strict JSON only, no markdown, no comments):
{
  "passages": [
    {
      "passage": "...",
      "questions": [
        {
          "question": "...",
          "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
          "correct": "B",
          "explanation": "..."
        },
        ...
      ]
    }
  ]
}`;
      }
    } else if (type === "Quant" || type === "GK") {
      return `
You are a quiz generator for an ed-tech app. Based on a given topic and difficulty, generate:
- ${numberOfQuestions} unique multiple-choice questions (MCQs) on the topic: "${topic}" at ${difficulty} level
- Each question should have 4 options (A-D), the correct answer key, and a 1–2 sentence explanation
Use random seed: ${seed} to ensure variety. 
Do not repeat questions from previous generations. 
Make each question fresh, never-before-seen, and use varied explanation styles.
Output format (strict JSON only, no markdown, no comments):
{
  "questions": [
    {
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "B",
      "explanation": "..."
    },
    ...
  ]
}`;
    } else if (type === "LRDI") {
      return `
You are a quiz generator for an ed-tech app. Based on a given topic and difficulty, generate:
- 1 logical reasoning or data interpretation scenario (table, chart, or description) on the topic: "${topic}" at ${difficulty} level
- For the scenario, generate ${numberOfQuestions} MCQs with options A-D
- Include the correct answer key and a 1–2 sentence explanation for each question
Use random seed: ${seed} to ensure variety. 
Do not repeat scenarios or questions from previous generations. 
Make each scenario and question fresh, never-before-seen, and use varied explanation styles.
Output format (strict JSON only, no markdown, no comments):
{
  "scenario": "...",
  "questions": [
    {
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "B",
      "explanation": "..."
    },
    ...
  ]
}`;
    } else {
      // Default to Quant
      return `
You are a quiz generator for an ed-tech app. Based on a given topic and difficulty, generate:
- ${numberOfQuestions} unique multiple-choice questions (MCQs) on the topic: "${topic}" at ${difficulty} level
- Each question should have 4 options (A-D), the correct answer key, and a 1–2 sentence explanation
Use random seed: ${seed} to ensure variety. 
Do not repeat questions from previous generations. 
Make each question fresh, never-before-seen, and use varied explanation styles.
Output format (strict JSON only, no markdown, no comments):
{
  "questions": [
    {
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "B",
      "explanation": "..."
    },
    ...
  ]
}`;
    }
  }

  // Alias map for common synonyms/misspellings
  const topicAliases = {
    "profit loss": "profit and loss",
    "invesae ratio": "inverse ratio",
    // Add more as needed
  };

  function cleanTopic(userInput) {
    let cleaned = userInput.toLowerCase().replace(/quants|lrdi|varc|gk|science|law|[-:]/gi, "").trim();
    if (topicAliases[cleaned]) return topicAliases[cleaned];
    return cleaned;
  }

  function findTopicFuzzy(userInput, syllabusSection) {
    const input = userInput.toLowerCase();
    const allTopics = [];
    const topicMap = {};
    for (const [topic, topicObj] of Object.entries(syllabusSection)) {
      allTopics.push(topic.toLowerCase());
      topicMap[topic.toLowerCase()] = { topic, subtopic: null, microtopic: null, ...topicObj };
      if (topicObj.subtopics) {
        for (const [sub, subObj] of Object.entries(topicObj.subtopics)) {
          allTopics.push(sub.toLowerCase());
          topicMap[sub.toLowerCase()] = { topic, subtopic: sub, microtopic: null, ...subObj };
          if (subObj.microtopics) {
            for (const micro of subObj.microtopics) {
              allTopics.push(micro.toLowerCase());
              topicMap[micro.toLowerCase()] = { topic, subtopic: sub, microtopic: micro, ...subObj };
            }
          }
        }
      }
    }
    const { bestMatch } = stringSimilarity.findBestMatch(input, allTopics);
    return bestMatch.rating > 0.6 ? topicMap[bestMatch.target] : null;
  }

  // Topic normalizer for typos/synonyms
  function normalizeTopic(input) {
    const synonyms = {
      "invesae ratio": "inverse ratio",
      "time speed": "time, speed and distance",
      "lrdi arrangement": "logical reasoning - seating arrangement",
      "permuation": "permutation and combination",
      "probablity": "probability",
      // add more mappings here0
    };
    const lower = input.trim().toLowerCase();
    return synonyms[lower] || lower;
  }

  // Extract just the JSON array from model output
  function extractValidJsonOnly(responseText) {
    const match = responseText.match(/\[.*\]/s); // extract array block
    return match ? match[0] : "{}";
  }

  async function generateMock(prompt, expectField) {
    let failCount = 0;
    for (let i = 0; i < freeModels.length; i++) {
      const model = freeModels[currentModelIndex];
      console.log(`🔄 Trying model: ${model}`); // Log model rotation
      try {
        const response = await axios.post(
          "https://api.together.xyz/v1/chat/completions",
          {
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            top_p: 0.95,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const rawOutput = response.data.choices[0].message.content;
        console.log("📝 Raw model output:", rawOutput); // Log raw output
        let jsonBlock;
        // Try to extract the expected field from object or array
        try {
          // Try to parse as object first
          const repaired = jsonrepair(rawOutput);
          const parsed = JSON.parse(repaired);
          if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed)) {
              // Sometimes model returns array directly
              return { quizJson: parsed, model };
            } else if (parsed[expectField]) {
              return { quizJson: parsed, model };
            } else {
              // Try to find first array in object
              const arrField = Object.values(parsed).find(v => Array.isArray(v));
              if (arrField) {
                return { quizJson: { [expectField]: arrField }, model };
              }
            }
          }
        } catch (e) {
          // fallback to old extraction
          jsonBlock = extractValidJsonOnly(rawOutput);
          try {
            const quizJson = JSON.parse(jsonrepair(jsonBlock));
            if (quizJson && Array.isArray(quizJson)) {
              return { quizJson, model };
            }
          } catch (e2) {
            // continue to failCount++
          }
        }
        failCount++;
        console.warn(`⚠️ Model ${model} returned unparsable JSON, trying next...`);
        console.warn("Broken response:", rawOutput);
        if (failCount >= 3) {
          throw new Error("Sorry, we're retrying. Please try again in a few seconds.");
        }
        currentModelIndex = (currentModelIndex + 1) % freeModels.length;
        continue;
      } catch (err) {
        failCount++;
        console.warn(`⚠️ Model ${model} failed, trying next...`, err.message);
        if (failCount >= 3) {
          throw new Error("Sorry, we're retrying. Please try again in a few seconds.");
        }
        currentModelIndex = (currentModelIndex + 1) % freeModels.length;
      }
    }
    throw new Error("❌ All free models failed or returned invalid JSON. Try again later.");
  }

  // Extract all topics, subtopics, and microtopics as a flat array
  function extractAllTopics(syllabus) {
    const allTopics = [];
    function walk(obj, path = []) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (key === 'microtopics' && Array.isArray(obj[key])) {
            obj[key].forEach(micro => {
              allTopics.push([...path, micro].join(' - '));
            });
          } else if (key === 'subtopics') {
            for (const sub in obj[key]) {
              allTopics.push([...path, sub].join(' - '));
              walk(obj[key][sub], [...path, sub]);
            }
          } else {
            walk(obj[key], [...path, key]);
          }
        } else if (key !== 'microtopics' && key !== 'subtopics') {
          allTopics.push([...path, key].join(' - '));
        }
      }
    }
    walk(syllabus);
    // Remove duplicates and filter out empty/short entries
    return [...new Set(allTopics)].filter(t => t && t.length > 3);
  }

  const validTopics = extractAllTopics(syllabus);
  const fuse = new Fuse(validTopics, {
    includeScore: true,
    threshold: 0.4, // controls how fuzzy — 0.0 is strict, 1.0 is very loose
  });

  function cleanInput(input) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove weird symbols
      .replace(/\s+/g, " ")         // multiple spaces → one
      .trim();
  }

  function getBestMatchedTopic(userInput) {
    const result = fuse.search(userInput);
    if (result.length === 0) return null;
    return result[0].item; // best match
  }

  try {
    let quizType = mode;
    let detectedCategory = null;
    if (!quizType) {
      detectedCategory = getCategoryFromTopic(topic);
      if (detectedCategory) {
        quizType = detectedCategory.toUpperCase();
      } else {
        // Classify the quiz type using the LLM
        quizType = await callTogetherClassifier(topic, difficulty, numberOfQuestions);
        quizType = quizType.trim().toUpperCase();
        if (["QUANT", "VARC", "LRDI", "GK"].includes(quizType)) {
          // ok
        } else {
          quizType = "QUANT";
        }
      }
    } else {
      quizType = quizType.trim().toUpperCase();
    }
    let expectField = "questions";
    if (quizType === "VARC") expectField = "passages";
    if (quizType === "LRDI") expectField = "scenario";
    // Try to match topic in syllabus for context-rich prompt
    let syllabusMatch = null;
    let prompt = null;
    // Try each section for a match
    for (const section of Object.keys(syllabus)) {
      syllabusMatch = findTopicFuzzy(topic, syllabus[section]);
      if (syllabusMatch) break;
    }
    if (syllabusMatch) {
      // Build context-rich prompt
      prompt = `You are a quiz generator for an ed-tech app. Generate ${numberOfQuestions} unique MCQs on "${topic}" (interpreted as "${syllabusMatch.topic}${syllabusMatch.subtopic ? ' > ' + syllabusMatch.subtopic : ''}${syllabusMatch.microtopic ? ' > ' + syllabusMatch.microtopic : ''}")`;
      if (syllabusMatch.formulas && syllabusMatch.formulas.length > 0) {
        prompt += ` Use the formula(s): ${syllabusMatch.formulas.join('; ')}.`;
      }
      prompt += ` Each question should have 4 options (A-D), the correct answer, and a 1–2 sentence explanation. Use random seed: ${seed} for variety. Output strict JSON: { "questions": [ ... ] }`;
    } else {
      // Fallback to previous template/category logic
      prompt = detectedCategory
        ? getPromptTemplate(detectedCategory, topic, difficulty, numberOfQuestions, seed)
        : getPromptByType(quizType);
    }
    let result;
    try {
      result = await generateMock(prompt, expectField);
    } catch (err) {
      console.error("🧠 Model call failed:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Model call failed or returned invalid output." });
      } else {
        return;
      }
    }

    if (!result || !result.quizJson) {
      console.error("❌ No valid quizJson extracted. Fallback triggered.");
      if (!res.headersSent) {
        return res.status(500).json({ error: "Model response invalid or unparsable" });
      } else {
        return;
      }
    }

    const { quizJson, model } = result;
    return res.status(200).json({ ...quizJson, model, quizType });
  } catch (error) {
    console.error("Together.ai Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Failed to generate mock questions" });
    } else {
      return;
    }
  }
});

module.exports = router; 