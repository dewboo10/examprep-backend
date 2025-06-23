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
      { name: "LRDI", timeLimit: 20 }
    ]
  },
  {
    name: "Common Management Admission Test",
    code: "CMAT",
    description: "MBA entrance by NTA",
    quizCount: 40,
    icon: "fas fa-briefcase",
    colorTheme: "teal",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 }
    ]
  },
  {
    name: "NMAT by GMAC",
    code: "NMAT",
    description: "MBA entrance by GMAC",
    quizCount: 40,
    icon: "fas fa-university",
    colorTheme: "blue",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 }
    ]
  },
  {
    name: "Bank Probationary Officer",
    code: "BANKPO",
    description: "Bank PO competitive exam",
    quizCount: 60,
    icon: "fas fa-piggy-bank",
    colorTheme: "green",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 },
      { name: "GK", timeLimit: 20 }
    ]
  },
  {
    name: "Staff Selection Commission CGL",
    code: "SSCCGL",
    description: "SSC Combined Graduate Level Exam",
    quizCount: 60,
    icon: "fas fa-users",
    colorTheme: "orange",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 },
      { name: "GK", timeLimit: 20 }
    ]
  },
  {
    name: "Bank Clerk",
    code: "BANKCLERK",
    description: "Bank Clerk competitive exam",
    quizCount: 50,
    icon: "fas fa-cash-register",
    colorTheme: "cyan",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 }
    ]
  },
  {
    name: "Common University Entrance Test",
    code: "CUET",
    description: "UG entrance by NTA",
    quizCount: 50,
    icon: "fas fa-graduation-cap",
    colorTheme: "red",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 }
    ]
  }
];
