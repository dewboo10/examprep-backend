// ✅ File: data/examsData.js

module.exports = [
  {
    name: "Common Admission Test",
    code: "CAT",
    description: "MBA entrance by IIMs",
    quizCount: 100,
    icon: "fas fa-chart-line",
    colorTheme: "indigo",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 }
    ]
  },
  {
    name: "Symbiosis National Aptitude Test",
    code: "SNAP",
    description: "MBA entrance by Symbiosis",
    quizCount: 50,
    icon: "fas fa-building",
    colorTheme: "purple",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "GA", timeLimit: 20 }
    ]
  }
];
