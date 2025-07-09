// data/questions/nmat/day2.js

module.exports = [
  {
    id: "nmat-day2-q1",
    exam: "NMAT",
    day: 2,
    section: "VARC",
    paragraph: `India’s economic rise in recent decades has been powered by an enormous young workforce. However, unemployment among youth remains high, especially in rural areas. Critics argue this is due to a disconnect between education and employability.`,
    question: "What is the main cause of youth unemployment according to critics?",
    options: [
      "Lack of job opportunities",
      "Outdated education system",
      "Economic slowdown",
      "Overpopulation"
    ],
    answerIndex: 1,
    correctAnswer: "Outdated education system",
    explanation: "Critics believe the root cause is a mismatch between the education system and job market needs.",
    videoLink: "https://www.youtube.com/embed/example?t=42"
  },
  {
    id: "nmat-day2-q2",
    exam: "NMAT",
    day: 2,
    section: "Quant",
    question: "If x + 1/x = 3, what is the value of x³ + 1/x³?",
    options: [
      "18",
      "27",
      "30",
      "None of these"
    ],
    answerIndex: 0,
    correctAnswer: "18",
    explanation: `Using identity: x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x)\n=> 3³ - 3×3 = 27 - 9 = 18`,
    videoLink: "https://www.youtube.com/embed/example2?t=55"
  },
  {
    id: "nmat-day2-q3",
    exam: "NMAT",
    day: 2,
    section: "LRDI",
    question: "Four friends A, B, C, and D sit around a circular table. B is to the left of A, and C is opposite B. Who is to the right of C?",
    options: [
      "A",
      "B",
      "D",
      "Cannot be determined"
    ],
    answerIndex: 2,
    correctAnswer: "D",
    explanation: "From the clues, seating order can be deduced. D ends up to the right of C.",
    videoLink: "https://www.youtube.com/embed/example3?t=101"
  }
];
