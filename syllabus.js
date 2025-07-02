// syllabus.js
// Comprehensive syllabus structure for Quants (Arithmetic, Algebra, Geometry, Modern Math, etc.)
// Each topic includes subtopics, microtopics, formulas/theorems, and relevant exam tags

const syllabus = {
  quants: {
    "Arithmetic & Number System": {
      subtopics: {
        "Ratio & Proportion": {
          microtopics: [
            "Direct & Inverse Ratios",
            "Componendo-Dividendo Rule",
            "Duplicate/Triplicate Ratios",
            "Proportionality Theorems"
          ],
          formulas: [
            "a/b = c/d ⇒ (a+b)/(b+d) = a/c",
            "Componendo: (a+b)/b = (c+d)/d"
          ],
          exams: ["CAT", "SSC", "Banking", "GMAT", "NMAT", "XAT", "IPMAT"]
        },
        "Percentages, Profit & Loss": {
          microtopics: [
            "Successive Percentage Changes",
            "Markup & Discount",
            "False Weight Concepts",
            "Cost Price (CP), Selling Price (SP), Marked Price (MP) Relations"
          ],
          formulas: [
            "Profit% = (SP - CP)/CP × 100",
            "Successive %: Net% = a + b + ab/100"
          ],
          exams: ["CAT", "SSC", "Banking", "GMAT", "NMAT", "XAT"]
        },
        "Averages & Mixtures": {
          microtopics: [
            "Weighted Average Formula",
            "Mixture or Alligation Rule for Two or More Samples"
          ],
          formulas: [
            "Average = Sum of Quantities / Number of Quantities",
            "Alligation Rule: (C2 - Mean):(Mean - C1) = Q1:Q2"
          ],
          exams: ["CAT", "SSC", "Banking", "GMAT", "NMAT"]
        },
        "Time & Work": {
          microtopics: [
            "Work Rate and Efficiency",
            "Man-Days Concept (Work = Rate × Time)",
            "Pipes & Cisterns (Inflow-Outflow Rates)"
          ],
          formulas: [
            "Work = Rate × Time",
            "Combined Rate = 1/A + 1/B for A and B working together"
          ],
          exams: ["CAT", "SSC", "Banking", "GMAT", "NMAT"]
        },
        "Time, Speed & Distance": {
          microtopics: [
            "Relative Speed (Same/Opposite Directions)",
            "Train and Boat Problems (Stream Speed)",
            "Circular Track Meetings"
          ],
          formulas: [
            "Speed = Distance / Time",
            "Relative Speed (Same Direction) = |v1 - v2|",
            "Relative Speed (Opposite Direction) = v1 + v2"
          ],
          exams: ["CAT", "SSC", "Banking", "GMAT", "NMAT"]
        },
        "Simple & Compound Interest": {
          microtopics: [
            "Annual, Half-Yearly Compounding",
            "Present Value, Installment Calculations",
            "Effective Annual Rate"
          ],
          formulas: [
            "SI = (P × R × T)/100",
            "CI = P(1 + R/100)^T - P"
          ],
          exams: ["CAT", "SSC", "Banking", "GMAT"]
        },
        "Basic Number Theory": {
          microtopics: [
            "Properties of Integers (Odd/Even, Prime)",
            "LCM and HCF",
            "Divisibility Rules, Remainders (Cyclicity)",
            "Factors, Multiples, Modular Arithmetic"
          ],
          formulas: [
            "Euclid's Algorithm for HCF",
            "If f(x) is divided by (x-a), remainder = f(a)"
          ],
          exams: ["CAT", "SSC", "Banking", "JEE", "GMAT"]
        }
      }
    },
    "Algebra": {
      subtopics: {
        "Linear Equations": {
          microtopics: [
            "Simultaneous Equations",
            "Applications in Age, Mixture, Ratio"
          ],
          formulas: [
            "ax + by = c",
            "Substitution, Elimination, Cross-multiplication"
          ],
          exams: ["CAT", "JEE", "SSC", "GMAT"]
        },
        "Quadratic Equations": {
          microtopics: [
            "Roots and Discriminant",
            "Viète's Formulas",
            "Forming Quadratic from Roots"
          ],
          formulas: [
            "ax^2 + bx + c = 0",
            "Roots: x = [-b ± √(b²-4ac)]/(2a)",
            "Sum of roots = -b/a, Product = c/a"
          ],
          exams: ["CAT", "JEE", "SSC", "GMAT"]
        },
        "Inequalities & Logs": {
          microtopics: [
            "Algebraic Solution Methods",
            "Graphical Representation",
            "AM-GM-HM Inequality",
            "Laws of Logarithms, Change of Base"
          ],
          formulas: [
            "If a > b and c > 0, then ac > bc",
            "log_a(bc) = log_a b + log_a c"
          ],
          exams: ["CAT", "JEE", "GMAT"]
        },
        "Sequences & Series": {
          microtopics: [
            "AP, GP, HP Formulas",
            "Special Series: Sum of Squares/Cubes, Telescoping"
          ],
          formulas: [
            "AP: a_n = a + (n-1)d",
            "Sum of AP: S_n = n/2 [2a + (n-1)d]",
            "GP: a_n = ar^{n-1}"
          ],
          exams: ["CAT", "JEE", "GMAT"]
        },
        "Reminder Theorem": {
          microtopics: [],
          formulas: [
            "If f(x) is divided by (x-a), remainder = f(a)"
          ],
          exams: ["CAT", "JEE"]
        }
      }
    },
    "Geometry": {
      subtopics: {
        "Triangles": {
          microtopics: [
            "Congruency Criteria (SSS, SAS, ASA, RHS)",
            "Similarity Criteria (AA, SSS, SAS)",
            "Pythagoras Theorem and Converse",
            "Special Triangles (30-60-90, 45-45-90)",
            "Apollonius' Theorem",
            "Angle Bisector Theorem"
          ],
          formulas: [
            "Sum of angles = 180°",
            "Area = (1/2) × base × height",
            "Pythagoras: a² + b² = c²",
            "Apollonius: AB² + AC² = 2(AD² + (1/2)BC²) for median AD"
          ],
          exams: ["CAT", "JEE", "SSC", "GMAT"]
        },
        "Circles": {
          microtopics: [
            "Angle Subtended by Diameter",
            "Equal Chords, Cyclic Quadrilaterals",
            "Tangents (Perpendicular to Radius)",
            "Arcs and Chords",
            "Angle in Same Segment Theorem"
          ],
          formulas: [
            "Angle in a semicircle = 90°",
            "Length of arc = θ/360 × 2πr",
            "Area of sector = θ/360 × πr²"
          ],
          exams: ["CAT", "JEE", "SSC", "GMAT"]
        },
        "Polygons & Quadrilaterals": {
          microtopics: [
            "Properties of Parallelogram, Rectangle, Rhombus, Trapezium",
            "Sum of Interior Angles",
            "Regular Polygon Properties"
          ],
          formulas: [
            "Sum of interior angles = (n-2) × 180°",
            "Area of parallelogram = base × height"
          ],
          exams: ["CAT", "JEE", "SSC"]
        },
        "Coordinate Geometry": {
          microtopics: [
            "Distance Formula",
            "Section Formula (Internal/External)",
            "Equation of a Line (Slope-Intercept, Two-Point)",
            "Slope Criteria for Parallel/Perpendicular Lines",
            "Midpoint Formula"
          ],
          formulas: [
            "Distance = √[(x2-x1)² + (y2-y1)²]",
            "Slope = (y2-y1)/(x2-x1)",
            "Equation: y = mx + c"
          ],
          exams: ["CAT", "JEE", "SSC", "GMAT"]
        }
      }
    },
    "Mensuration": {
      subtopics: {
        "2D Mensuration": {
          microtopics: [
            "Area and Perimeter of Triangle, Quadrilateral, Circle",
            "Area of Sector and Segment",
            "Composite Figures"
          ],
          formulas: [
            "Area of triangle = (1/2) × base × height",
            "Area of circle = πr²",
            "Perimeter of circle = 2πr"
          ],
          exams: ["CAT", "SSC", "Banking", "JEE"]
        },
        "3D Mensuration": {
          microtopics: [
            "Surface Area and Volume of Prism, Cylinder, Cone, Sphere, Frustum",
            "Composite Solids"
          ],
          formulas: [
            "Volume of cylinder = πr²h",
            "Surface area of sphere = 4πr²",
            "Volume of cone = (1/3)πr²h"
          ],
          exams: ["CAT", "SSC", "JEE"]
        }
      }
    },
    "Modern Math": {
      subtopics: {
        "Permutation & Combination": {
          microtopics: [
            "Fundamental Counting Principle",
            "Linear and Circular Arrangements",
            "Identical Items, Derangements"
          ],
          formulas: [
            "nPr = n!/(n-r)!",
            "nCr = n!/[r!(n-r)!]"
          ],
          exams: ["CAT", "JEE", "GMAT", "SSC"]
        },
        "Probability": {
          microtopics: [
            "Sample Space, Events",
            "Addition and Multiplication Rules",
            "Conditional Probability, Bayes' Theorem",
            "Random Variables, Simple Distributions"
          ],
          formulas: [
            "P(A) = Number of favorable outcomes / Total outcomes",
            "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
            "Bayes' Theorem: P(A|B) = P(B|A)P(A)/P(B)"
          ],
          exams: ["CAT", "JEE", "GMAT", "SSC"]
        },
        "Set Theory": {
          microtopics: [
            "Union, Intersection, Complement",
            "Venn Diagrams",
            "De Morgan's Laws"
          ],
          formulas: [
            "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
            "n(A ∪ B ∪ C) = n(A) + n(B) + n(C) - n(A ∩ B) - n(B ∩ C) - n(A ∩ C) + n(A ∩ B ∩ C)"
          ],
          exams: ["CAT", "JEE", "SSC"]
        },
        "Functions": {
          microtopics: [
            "Domain, Range, Types of Functions",
            "Composite and Inverse Functions"
          ],
          formulas: [
            "f(x) = ax + b",
            "f(g(x)) = f∘g(x)"
          ],
          exams: ["CAT", "JEE", "GMAT"]
        }
      }
    }
  },
  lrdi: {
    "Analytical Puzzles": {
      subtopics: {
        "Seating Arrangements": {
          microtopics: [
            "Linear Arrangement (Row, with Conditions)",
            "Circular Arrangement (Table, Facing Inward/Outward)"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "NMAT", "IPMAT", "SSC", "Banking"]
        },
        "Grouping & Selection": {
          microtopics: [
            "Team/Committee Formation under Constraints",
            "Distribution, Selection, Assignment"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "NMAT", "SSC", "Banking"]
        },
        "Ordering & Ranking": {
          microtopics: [
            "Arranging by Height, Weight, Age",
            "Ranking with Comparisons"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC", "Banking"]
        },
        "Blood Relations": {
          microtopics: [
            "Family Tree Problems",
            "Coded Relations across Generations"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC", "Banking"]
        },
        "Directions & Routes": {
          microtopics: [
            "Cardinal Direction Puzzles",
            "Distance, Turns, Final Location"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC", "Banking"]
        },
        "Clocks & Calendars": {
          microtopics: [
            "Angles between Hands",
            "Calendar Day on a Given Date"
          ],
          formulas: [
            "Angle = |30*hour - (11/2)*minutes| (Clock)",
            "Odd Days Calculation (Calendar)"
          ],
          exams: ["CAT", "SSC", "Banking"]
        },
        "Syllogisms & Deductions": {
          microtopics: [
            "Categorical Statements (All/Some/None)",
            "Drawing Valid Conclusions"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC", "Banking"]
        },
        "Coding-Decoding": {
          microtopics: [
            "Word or Number Coding Patterns",
            "Alphanumeric Codes"
          ],
          formulas: [],
          exams: ["SSC", "Banking"]
        },
        "Series & Analogies": {
          microtopics: [
            "Alphabet Series",
            "Number Series",
            "Analogical Reasoning (A:B :: C:?)"
          ],
          formulas: [],
          exams: ["SSC", "Banking", "IPMAT"]
        },
        "Critical Reasoning": {
          microtopics: [
            "Assumption, Conclusion",
            "Strengthen/Weaken Argument",
            "Course of Action"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "GMAT", "CLAT"]
        }
      }
    },
    "Logical Games & Higher-Level Puzzles": {
      subtopics: {
        "Scheduling": {
          microtopics: [
            "Calendar and Timetable Puzzles",
            "Task/Person Assignment with Constraints"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC"]
        },
        "Floor/Matrix Puzzles": {
          microtopics: [
            "People on Different Floors",
            "Grid/Matrix Deduction"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC"]
        },
        "Tournaments/Games": {
          microtopics: [
            "Players, Matches, Wins/Losses",
            "Scoring Systems"
          ],
          formulas: [],
          exams: ["CAT", "XAT"]
        },
        "Puzzle Caselets": {
          microtopics: [
            "Complex Scenarios Combining Multiple Logic Elements",
            "True/False Consistency Checks"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC"]
        },
        "Venn Diagrams & Set-Based": {
          microtopics: [
            "Survey Overlaps",
            "Set Operations"
          ],
          formulas: [
            "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)"
          ],
          exams: ["CAT", "XAT", "SSC"]
        }
      }
    },
    "Data Interpretation (DI)": {
      subtopics: {
        "Tabular DI": {
          microtopics: [
            "Tables with Data (Sales, Population, etc.)",
            "Calculations: Percentages, Differences"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC", "Banking"]
        },
        "Graphs and Charts": {
          microtopics: [
            "Bar Graphs",
            "Line Graphs",
            "Pie Charts",
            "Comparisons between Graphs"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC", "Banking"]
        },
        "Caselet DI": {
          microtopics: [
            "Data in Paragraph Form",
            "Forming Table or Analysis"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "SSC"]
        },
        "Data Sufficiency": {
          microtopics: [
            "Given Data and a Question",
            "Determine Sufficiency of Statements"
          ],
          formulas: [],
          exams: ["CAT", "XAT", "GMAT", "IPMAT"]
        },
        "Mixed Graphs": {
          microtopics: [
            "Combination of Chart Types (Bar + Line, etc.)"
          ],
          formulas: [],
          exams: ["CAT", "XAT"]
        },
        "Calculation Intensive": {
          microtopics: [
            "Speed of Calculation (Ratios, Growth Rates)"
          ],
          formulas: [],
          exams: ["CAT", "SSC", "Banking"]
        }
      }
    },
    "Decision Making (XAT-specific)": {
      subtopics: {
        "Business Scenarios": {
          microtopics: [
            "Analyzing Situations in Business/Organization Contexts",
            "Ethical Dilemmas, Profit vs Ethics"
          ],
          formulas: [],
          exams: ["XAT"]
        },
        "Caselets": {
          microtopics: [
            "Short Case Studies",
            "Best Decision or Evaluation of Outcomes"
          ],
          formulas: [],
          exams: ["XAT"]
        },
        "Analytical Reasoning in Context": {
          microtopics: [
            "Situational Judgment",
            "Resource Allocation, Personnel Decisions"
          ],
          formulas: [],
          exams: ["XAT"]
        }
      }
    }
  },
  varc: {
    "Grammar & Vocabulary": {
      subtopics: {
        "Grammar Usage": {
          microtopics: [
            "Parts of Speech",
            "Tenses",
            "Verb Forms",
            "Prepositions",
            "Articles",
            "Subject-Verb Agreement",
            "Pronoun Reference",
            "Modifier Placement",
            "Parallelism"
          ],
          exams: ["CAT", "XAT", "NMAT", "SSC", "Banking", "CLAT", "GMAT"]
        },
        "Sentence Correction": {
          microtopics: [
            "Error Spotting",
            "Correcting Subject-Verb, Tense, Modifier, Parallelism Errors"
          ],
          exams: ["CAT", "XAT", "SSC", "Banking", "GMAT"]
        },
        "Sentence Completion (Fill in the Blanks)": {
          microtopics: [
            "Single/Double Blanks",
            "Vocabulary and Contextual Understanding"
          ],
          exams: ["CAT", "XAT", "SSC", "Banking", "GMAT"]
        },
        "Vocabulary": {
          microtopics: [
            "Synonyms",
            "Antonyms",
            "Idioms and Phrases",
            "Word Meanings",
            "Spelling",
            "One-word Substitution"
          ],
          exams: ["CAT", "XAT", "SSC", "Banking", "CLAT", "GMAT"]
        },
        "Cloze Tests": {
          microtopics: [
            "Passage with Multiple Blanks",
            "Grammar and Vocabulary in Context"
          ],
          exams: ["SSC", "Banking"]
        }
      }
    },
    "Verbal Reasoning": {
      subtopics: {
        "Para Jumbles (Sentence Rearrangement)": {
          microtopics: [
            "Logical Flow",
            "Connectors",
            "Odd Sentence Out"
          ],
          exams: ["CAT", "XAT", "NMAT", "CLAT", "GMAT"]
        },
        "Paragraph Completion": {
          microtopics: [
            "Best Completion",
            "Logical Consistency"
          ],
          exams: ["CAT", "XAT", "GMAT"]
        },
        "Critical Reasoning": {
          microtopics: [
            "Assumptions",
            "Inferences",
            "Strengthen/Weaken Arguments",
            "Fact/Inference/Judgment"
          ],
          exams: ["CAT", "XAT", "GMAT", "CLAT"]
        },
        "Analogies": {
          microtopics: [
            "Word Pair Relationships",
            "A:B :: C:?"
          ],
          exams: ["SSC", "Banking", "GMAT"]
        },
        "Syllogisms": {
          microtopics: [
            "Categorical Statements",
            "Drawing Conclusions"
          ],
          exams: ["SSC", "Banking"]
        }
      }
    },
    "Reading Comprehension (RC)": {
      subtopics: {
        "Passage Understanding": {
          microtopics: [
            "Main Idea",
            "Author's Tone",
            "Genre: Science, Economics, Literature, Current Affairs, etc."
          ],
          exams: ["CAT", "XAT", "NMAT", "CLAT", "GMAT"]
        },
        "Inference Questions": {
          microtopics: [
            "Deducing Meaning or Conclusions Not Directly Stated"
          ],
          exams: ["CAT", "XAT", "GMAT"]
        },
        "Specific Detail & Fact": {
          microtopics: [
            "Explicit Information from the Passage"
          ],
          exams: ["CAT", "XAT", "GMAT"]
        },
        "Vocabulary in Context": {
          microtopics: [
            "Meaning of Words/Phrases as Used in the Passage"
          ],
          exams: ["CAT", "XAT", "GMAT"]
        },
        "Tone and Attitude": {
          microtopics: [
            "Identifying Author's Tone (Critical, Sarcastic, Optimistic, etc.)"
          ],
          exams: ["CAT", "XAT", "GMAT"]
        },
        "Title/Summary": {
          microtopics: [
            "Choosing an Apt Title",
            "Summarizing the Passage's Key Idea"
          ],
          exams: ["CAT", "XAT", "GMAT"]
        }
      }
    },
    "Writing Ability": {
      subtopics: {
        "Essay Writing": {
          microtopics: [
            "Argumentative Essay",
            "Analytical Essay",
            "Descriptive Essay"
          ],
          exams: ["XAT", "UPSC", "CLAT", "GMAT"]
        },
        "Précis and Letter Writing": {
          microtopics: [
            "Précis Writing",
            "Formal/Informal Letters"
          ],
          exams: ["Banking", "UPSC"]
        },
        "Analytical Writing Assessment": {
          microtopics: [
            "Essay Analyzing an Argument"
          ],
          exams: ["GMAT"]
        }
      }
    }
  },
  gk: {
    "Static GK": {
      subtopics: {
        "History": {
          microtopics: [
            "Ancient Civilizations",
            "Medieval India",
            "Modern History (Indian Freedom Struggle)",
            "World History (World Wars, Industrial Revolution)"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT", "CAT", "XAT"]
        },
        "Geography": {
          microtopics: [
            "Physical Geography (Mountains, Rivers, Climate)",
            "Indian Geography (States, Capitals, Resources)",
            "World Geography (Continents, Oceans, Phenomena)"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT", "CAT", "XAT"]
        },
        "Polity": {
          microtopics: [
            "Indian Constitution",
            "Fundamental Rights & Duties",
            "Directive Principles",
            "Structure of Government (Parliament, Executive, Judiciary)",
            "Amendments & Landmark Judgments"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT", "CAT", "XAT"]
        },
        "Economy": {
          microtopics: [
            "Basic Economic Concepts (GDP, Inflation, Fiscal Policy)",
            "Economic History of India",
            "Banking Terms (Repo Rate, CRR, NEFT)",
            "Budget & Fiscal News"
          ],
          exams: ["SSC", "Banking", "UPSC", "CAT", "XAT"]
        },
        "Science & Technology": {
          microtopics: [
            "Basic Science Facts (Physics, Chemistry, Biology)",
            "Recent Developments (IT, Space, Biotech)",
            "Inventions & Discoveries"
          ],
          exams: ["SSC", "Banking", "UPSC", "CAT", "XAT"]
        },
        "Environment & Ecology": {
          microtopics: [
            "Biodiversity, National Parks",
            "Environmental Treaties",
            "Sustainable Development"
          ],
          exams: ["SSC", "Banking", "UPSC", "CAT", "XAT"]
        },
        "Art & Culture": {
          microtopics: [
            "Indian Dance Forms, Festivals, Heritage Sites",
            "World Heritage, Art Movements"
          ],
          exams: ["SSC", "UPSC", "CLAT"]
        },
        "Sports": {
          microtopics: [
            "Major Tournaments",
            "Records & Awards",
            "Sports Terms"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT"]
        },
        "Miscellaneous": {
          microtopics: [
            "Important Days & Dates",
            "Books & Authors",
            "National Symbols",
            "International Organizations (UN, IMF, World Bank)"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT", "CAT", "XAT"]
        }
      }
    },
    "Current Affairs": {
      subtopics: {
        "National News": {
          microtopics: [
            "Government Schemes",
            "Bills & Acts",
            "Economic News (Budget, RBI Policy)"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT", "CAT", "XAT"]
        },
        "International News": {
          microtopics: [
            "Summits & Conferences",
            "International Agreements",
            "Geopolitical Events"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT", "CAT", "XAT"]
        },
        "Sports": {
          microtopics: [
            "Major Tournament Winners",
            "Records & Awards in Sports"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT"]
        },
        "Awards & Honors": {
          microtopics: [
            "Nobel Prizes",
            "Bharat Ratna, Padma Awards",
            "Oscars, Other Major Awards"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT"]
        },
        "Science/Tech": {
          microtopics: [
            "New Scientific Missions",
            "Tech Breakthroughs",
            "Health Updates (COVID-19, etc.)"
          ],
          exams: ["SSC", "Banking", "UPSC", "CAT", "XAT"]
        },
        "Persons in News": {
          microtopics: [
            "Prominent Appointments",
            "Obituaries",
            "Important Dignitaries"
          ],
          exams: ["SSC", "Banking", "UPSC", "CLAT"]
        },
        "Reports & Indexes": {
          microtopics: [
            "Release of Important Indices (HDI, Ease of Doing Business)",
            "Government Reports (Economic Survey, IPCC, etc.)"
          ],
          exams: ["SSC", "Banking", "UPSC", "CAT", "XAT"]
        }
      }
    }
  },
  science: {
    "Physics": {
      subtopics: {
        "Mechanics": {
          microtopics: [
            "Kinematics (1D, 2D)",
            "Laws of Motion",
            "Work, Energy, Power",
            "Circular Motion",
            "Center of Mass & Momentum Conservation",
            "Rotational Motion",
            "Gravitation"
          ],
          exams: ["JEE", "NEET", "CBSE", "SSC", "UPSC"]
        },
        "Properties of Matter": {
          microtopics: [
            "Elasticity",
            "Fluid Mechanics (Pressure, Buoyancy, Bernoulli)",
            "Surface Tension",
            "Viscosity",
            "Thermodynamics",
            "Kinetic Theory of Gases"
          ],
          exams: ["JEE", "NEET", "CBSE", "SSC"]
        },
        "Waves & Oscillations": {
          microtopics: [
            "Simple Harmonic Motion",
            "Wave Motion",
            "Sound Waves (Beats, Doppler Effect)"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        },
        "Electricity & Magnetism": {
          microtopics: [
            "Electrostatics",
            "Current Electricity",
            "Magnetism",
            "Electromagnetic Induction",
            "Alternating Current",
            "Electromagnetic Waves"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        },
        "Optics": {
          microtopics: [
            "Ray Optics (Reflection, Refraction, Lenses, Mirrors)",
            "Wave Optics (Interference, Diffraction, Polarization)"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        },
        "Modern Physics": {
          microtopics: [
            "Dual Nature of Matter & Radiation",
            "Atomic Structure",
            "Nuclear Physics",
            "Semiconductor Electronics"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        }
      }
    },
    "Chemistry": {
      subtopics: {
        "Physical Chemistry": {
          microtopics: [
            "Mole Concept & Stoichiometry",
            "Atomic Structure",
            "Chemical Bonding",
            "Thermodynamics",
            "Chemical & Ionic Equilibrium",
            "Electrochemistry",
            "Chemical Kinetics",
            "Solutions",
            "Surface Chemistry"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        },
        "Inorganic Chemistry": {
          microtopics: [
            "Periodic Table & Periodicity",
            "s-block, p-block, d-block, f-block Elements",
            "Coordination Compounds",
            "Metallurgy",
            "Environmental Chemistry"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        },
        "Organic Chemistry": {
          microtopics: [
            "IUPAC Nomenclature",
            "General Organic Chemistry (Electron Effects, Intermediates)",
            "Hydrocarbons",
            "Functional Groups (Alcohols, Aldehydes, Ketones, etc.)",
            "Polymers",
            "Biomolecules",
            "Reaction Mechanisms (SN1, SN2, E1, E2, etc.)"
          ],
          exams: ["JEE", "NEET", "CBSE"]
        }
      }
    },
    "Biology": {
      subtopics: {
        "Diversity of Living Organisms": {
          microtopics: [
            "Taxonomy & Classification",
            "Plant & Animal Kingdoms"
          ],
          exams: ["NEET", "CBSE", "UPSC"]
        },
        "Structural Organization": {
          microtopics: [
            "Anatomy of Flowering Plants",
            "Morphology of Plants",
            "Animal Tissues, Anatomy"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Cell Biology & Genetics": {
          microtopics: [
            "Cell Structure & Function",
            "Biomolecules",
            "Mitosis & Meiosis",
            "Mendelian Genetics",
            "Human Genetics",
            "Molecular Genetics",
            "Evolution"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Plant Physiology": {
          microtopics: [
            "Photosynthesis",
            "Plant Respiration",
            "Transport in Plants",
            "Plant Hormones"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Human Physiology": {
          microtopics: [
            "Digestive System",
            "Circulatory System",
            "Respiratory System",
            "Excretory System",
            "Nervous System",
            "Muscular System",
            "Endocrine System"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Reproduction & Development": {
          microtopics: [
            "Reproduction in Plants",
            "Human Reproduction",
            "Reproductive Health"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Biology in Human Welfare": {
          microtopics: [
            "Pathogens & Human Diseases",
            "Immunity",
            "Microbes in Food, Industry, Environment"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Biotechnology": {
          microtopics: [
            "Genetic Engineering Principles",
            "Applications in Agriculture & Medicine"
          ],
          exams: ["NEET", "CBSE"]
        },
        "Ecology & Environment": {
          microtopics: [
            "Ecosystem Structure",
            "Biogeochemical Cycles",
            "Population Ecology",
            "Biodiversity & Conservation",
            "Environmental Issues"
          ],
          exams: ["NEET", "CBSE", "UPSC"]
        }
      }
    }
  },
  law: {
    "Constitutional Law": {
      subtopics: {
        "Indian Constitution": {
          microtopics: [
            "Salient Features",
            "Preamble Values",
            "Borrowed Features"
          ],
          exams: ["CLAT", "Judiciary", "UPSC"]
        },
        "Fundamental Rights": {
          microtopics: [
            "Articles 12–35",
            "Right to Equality (Art. 14–18)",
            "Right to Freedom (19–22)",
            "Landmark Cases (Kesavananda Bharati, Puttaswamy)",
            "Restrictions and Scope"
          ],
          exams: ["CLAT", "Judiciary", "UPSC"]
        },
        "Directive Principles of State Policy": {
          microtopics: [
            "Articles 36–51",
            "Differences with Fundamental Rights"
          ],
          exams: ["CLAT", "Judiciary", "UPSC"]
        },
        "Fundamental Duties": {
          microtopics: [
            "Article 51A Duties of Citizens"
          ],
          exams: ["CLAT", "Judiciary", "UPSC"]
        },
        "Structure of Government": {
          microtopics: [
            "Parliament and State Legislatures",
            "Executive (President/Governor, Emergency Provisions)",
            "Judiciary (Supreme Court, Judicial Review, High Courts)"
          ],
          exams: ["CLAT", "Judiciary", "UPSC"]
        },
        "Amendments & Landmark Judgments": {
          microtopics: [
            "42nd, 44th, 73rd, 74th, 101st Amendments",
            "Landmark Supreme Court Judgments"
          ],
          exams: ["CLAT", "Judiciary", "UPSC"]
        }
      }
    },
    "Indian Penal Code & Criminal Law": {
      subtopics: {
        "IPC Basics": {
          microtopics: [
            "Cognizable vs Non-cognizable Offences",
            "Bailable vs Non-bailable",
            "General Exceptions (Insanity, Self-defense)"
          ],
          exams: ["Judiciary", "CLAT"]
        },
        "Key IPC Sections": {
          microtopics: [
            "Section 299-300 (Culpable Homicide vs Murder)",
            "Section 375 (Definition of Rape)",
            "Section 420 (Cheating)"
          ],
          exams: ["Judiciary", "CLAT"]
        },
        "Criminal Procedure Code (CrPC)": {
          microtopics: [
            "Stages of Criminal Trial",
            "FIR, Bail, Evidence Collection"
          ],
          exams: ["Judiciary"]
        },
        "Evidence Act Basics": {
          microtopics: [
            "What Constitutes Evidence",
            "Burden of Proof"
          ],
          exams: ["Judiciary"]
        }
      }
    },
    "Civil Law & Other Laws": {
      subtopics: {
        "Law of Contracts": {
          microtopics: [
            "Essential Elements of a Valid Contract",
            "Breach of Contract and Remedies",
            "Special Contracts (Indemnity, Guarantee)"
          ],
          exams: ["Judiciary", "CLAT"]
        },
        "Torts": {
          microtopics: [
            "Negligence",
            "Vicarious Liability",
            "Strict and Absolute Liability",
            "Defamation"
          ],
          exams: ["Judiciary", "CLAT"]
        },
        "Family Law": {
          microtopics: [
            "Marriage and Divorce Grounds",
            "Inheritance Principles (Will vs Intestate Succession)"
          ],
          exams: ["Judiciary"]
        },
        "Specific Relief & Transfer of Property": {
          microtopics: [
            "Specific Performance, Injunction",
            "Property Rights (Sale, Mortgage, Lease)"
          ],
          exams: ["Judiciary"]
        },
        "Contemporary Legal Developments": {
          microtopics: [
            "Recent Laws (Data Protection Bill, Criminal Law Amendments)",
            "Landmark Judgments from Past Year"
          ],
          exams: ["CLAT", "Judiciary"]
        }
      }
    },
    "Legal Reasoning & Awareness (CLAT focus)": {
      subtopics: {
        "Principle-Fact Reasoning": {
          microtopics: [
            "Application of Legal Principles to Facts",
            "Contracts, Torts, Criminal Law, Constitutional Law"
          ],
          exams: ["CLAT"]
        },
        "Legal Maxims": {
          microtopics: [
            "Common Latin Maxims (e.g., volenti non fit injuria, ignorantia juris non excusat)"
          ],
          exams: ["CLAT"]
        },
        "Legal GK": {
          microtopics: [
            "Important Amendments",
            "Landmark Supreme Court Cases",
            "New Laws or Bills in News"
          ],
          exams: ["CLAT"]
        },
        "Law Subjects for PG": {
          microtopics: [
            "Contracts, Torts, Criminal Law, Constitutional Law, International Law, IPR, Recent Case-laws"
          ],
          exams: ["Judiciary"]
        }
      }
    }
  }
};

// --- CAT (Common Admission Test) ---
syllabus.CAT = {
  QuantitativeAptitude: {
    Arithmetic: {
      topics: [
        "Ratio & Proportion",
        "Percentages",
        "Profit/Loss",
        "Averages",
        "Mixtures & Alligation",
        "Time and Work",
        "Time-Speed-Distance",
        "Simple & Compound Interest"
      ],
      notes: "Emphasis on core concepts like proportionality rules and successive percentage changes",
      formulas: [
        "Profit% = (SP - CP)/CP × 100",
        "Successive %: Net% = a + b + ab/100",
        "Speed = Distance / Time",
        "Work = Rate × Time"
      ],
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
    },
    Algebra: {
      topics: [
        "Linear and Quadratic Equations",
        "Inequalities",
        "Exponents & Logarithms",
        "Sequences & Series"
      ],
      subtopics: {
        "Linear and Quadratic Equations": [
          "Finding roots",
          "Vieta's formulas"
        ],
        "Inequalities": [
          "AM-GM inequality",
          "Modulus-based problems"
        ]
      },
      formulas: [
        "ax^2 + bx + c = 0",
        "Roots: x = [-b ± √(b²-4ac)]/(2a)",
        "Sum of roots = -b/a, Product = c/a"
      ],
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
    },
    GeometryMensuration: {
      topics: [
        "Triangles (congruence, similarity, theorems)",
        "Circles (tangent, chord properties)",
        "Polygons",
        "Coordinate Geometry (distance, section formulas)",
        "Mensuration (area, volume for 2D/3D figures)"
      ],
      notes: "Key theorems like Pythagoras and basic proportionality (Thales' theorem) are useful.",
      formulas: [
        "Area = (1/2) × base × height",
        "Pythagoras: a² + b² = c²",
        "Area of sector = θ/360 × πr²"
      ],
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
    },
    ModernMath: {
      topics: [
        "Permutation & Combination",
        "Probability",
        "Set Theory",
        "Functions"
      ],
      subtopics: {
        "Permutation & Combination": [
          "Arrangements",
          "Combinations",
          "Circular permutations",
          "Derangements"
        ],
        "Probability": [
          "Basic probability rules",
          "Bayes' Theorem",
          "Conditional probability"
        ]
      },
      formulas: [
        "nPr = n!/(n-r)!",
        "nCr = n!/r!(n-r)!",
        "P(A or B) = P(A) + P(B) - P(A and B)"
      ],
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
    }
  },
  DILR: {
    DataInterpretation: {
      topics: [
        "Tables",
        "Bar/Line graphs",
        "Pie charts",
        "Caselets"
      ],
      notes: "Interpret numerical data, calculate aggregates, percentages, growth rates, often combining information from multiple sources.",
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
    },
    LogicalReasoning: {
      topics: [
        "Seating Arrangements (linear, circular)",
        "Grouping and Selection",
        "Blood Relations",
        "Scheduling (calendars, timelines)",
        "Venn Diagrams",
        "Puzzles"
      ],
      notes: "LR questions test the ability to deduce conclusions from given conditions.",
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
    }
  },
  VARC: {
    ReadingComprehension: {
      topics: [
        "Passages from diverse topics (economy, science, literature, etc.)"
      ],
      notes: "Questions on main idea, inferences, tone, and fact vs. opinion. Emphasis on understanding and interpreting under time constraints.",
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "CLAT"]
    },
    VerbalAbility: {
      topics: [
        "Paragraph jumbles",
        "Paragraph completion",
        "Sentence Correction",
        "Vocabulary-based questions",
        "Critical Reasoning"
      ],
      notes: "Includes grammar and usage, synonyms/antonyms, fill-in-the-blanks, strengthen/weaken arguments, find assumptions.",
      exams: ["CAT", "XAT", "NMAT", "IPMAT", "GMAT", "CLAT"]
    }
  }
};

// --- XAT (Xavier Aptitude Test) ---
syllabus.XAT = {
  QuantitativeAbilityDI: {
    topics: [
      "Arithmetic (ratios, percentages, profit/loss, averages, mixtures, time & work, TSD, SI/CI)",
      "Algebra (linear/quadratic equations, inequalities, logs, progressions)",
      "Geometry & Mensuration (triangles, circles, polygons, coordinate geometry, area/volume)",
      "Modern Math (P&C, probability, sets, functions)",
      "Data Interpretation (tables, charts, graphs, caselets)"
    ],
    notes: "Syllabus is largely the same as CAT's QA and DI. Special focus on arithmetic and geometry.",
    exams: ["XAT", "CAT", "NMAT", "IPMAT", "GMAT", "SSC", "Banking"]
  },
  VerbalAbilityLR: {
    topics: [
      "Reading Comprehension",
      "Critical Reasoning",
      "Vocabulary",
      "Grammar",
      "Paragraph jumbles/completion",
      "Analytical puzzles embedded in verbal questions"
    ],
    notes: "Similar to CAT VARC. Logical Reasoning here refers to critical reasoning and analytical puzzles in verbal section.",
    exams: ["XAT", "CAT", "NMAT", "IPMAT", "GMAT", "CLAT"]
  },
  DecisionMaking: {
    topics: [
      "Business scenarios",
      "Ethical dilemmas",
      "Resource allocation",
      "Employee management issues",
      "Analytical reasoning caselets"
    ],
    notes: "Unique to XAT. Tests logical judgment, data analysis, and ethical reasoning. No prerequisite knowledge required.",
    exams: ["XAT"]
  },
  GeneralKnowledge: {
    topics: [
      "Static GK (world events, awards, geography, books/authors, science, etc.)",
      "Current Affairs (business, politics, sports, technology)"
    ],
    notes: "GK is not counted in percentile but considered by some institutes. Focus on business-economy news and conventional GK topics.",
    exams: ["XAT"]
  },
  EssayWriting: {
    topics: [
      "Short essay writing (~250 words)",
      "Abstract or opinion-based topics (quotes, policy issues, etc.)"
    ],
    notes: "Tests written communication and coherent expression. Evaluated if shortlisted for further admission process.",
    exams: ["XAT"]
  }
};

// --- NMAT (NMIMS Management Aptitude Test) ---
syllabus.NMAT = {
  LanguageSkills: {
    topics: [
      "Reading Comprehension (short passages)",
      "Grammar and Usage (error spotting, sentence correction)",
      "Vocabulary (synonyms, antonyms, analogies, fill-in-the-blanks)",
      "Critical reasoning-type questions"
    ],
    exams: ["NMAT", "CAT", "XAT", "IPMAT", "GMAT"]
  },
  QuantitativeSkills: {
    topics: [
      "Arithmetic (ratios, percentages, profit/loss, SI/CI, time & work, TSD)",
      "Algebra (linear/quadratic equations, inequalities)",
      "Geometry/Mensuration (lines, angles, triangles, circles, areas/volumes)",
      "Modern Math (P&C, probability, sets)",
      "Data Interpretation (tables, charts, graphs)"
    ],
    exams: ["NMAT", "CAT", "XAT", "IPMAT", "GMAT", "SSC", "Banking"]
  },
  LogicalReasoning: {
    topics: [
      "Analytical Puzzles (arrangements, grouping, selection, blood relations, directions, series)",
      "Logical puzzles (coding-decoding, classification, analogies, calendar)",
      "Verbal Reasoning (syllogisms, course of action, statement-conclusions, critical reasoning)"
    ],
    exams: ["NMAT", "CAT", "XAT", "IPMAT", "GMAT", "SSC", "Banking"]
  }
};

// --- IPMAT (IIM Integrated Program in Management Aptitude Test) ---
syllabus.IPMAT = {
  QuantitativeAbility: {
    topics: [
      "Number Systems",
      "Percentages",
      "Profit & Loss",
      "Average",
      "Ratio & Proportion",
      "Time & Work",
      "Time-Speed-Distance",
      "Algebra (polynomials, linear/quadratic equations, exponents, logarithms, progressions, matrices)",
      "Geometry & Mensuration (triangles, circles, coordinate geometry, area/volume)",
      "Sets and Probability (Venn diagrams, basic probability, counting principles, P&C)",
      "Data Interpretation (tables, charts, caselets)"
    ],
    notes: "IIM Indore: QA split into MCQ and Short-Answer. IIM Rohtak: QA + separate Logical Reasoning section.",
    exams: ["IPMAT", "CAT", "XAT", "NMAT", "GMAT", "SSC", "Banking"]
  },
  VerbalAbility: {
    topics: [
      "Reading Comprehension",
      "Vocabulary (synonym/antonym, word usage)",
      "Grammar (error spotting, sentence correction)",
      "Sentence completion",
      "Para-jumbles and Para-completion",
      "Critical reasoning questions"
    ],
    exams: ["IPMAT", "CAT", "XAT", "NMAT", "GMAT", "CLAT"]
  },
  LogicalReasoning: {
    topics: [
      "Arrangements",
      "Logical sequences",
      "Analogies",
      "Series",
      "Puzzles"
    ],
    notes: "Distinct LR section in IIM Rohtak only.",
    exams: ["IPMAT", "CAT", "XAT", "NMAT", "GMAT", "SSC", "Banking"]
  }
};

// --- GMAT (Graduate Management Admission Test) ---
syllabus.GMAT = {
  AnalyticalWriting: {
    topics: [
      "Argument analysis essay (evaluate logic, identify assumptions/flaws, suggest improvements)"
    ],
    notes: "Structure: introduction, body (flaws), conclusion. No personal opinion required.",
    exams: ["GMAT"]
  },
  IntegratedReasoning: {
    topics: [
      "Multi-Source Reasoning",
      "Table Analysis",
      "Graphical Interpretation",
      "Two-Part Analysis"
    ],
    notes: "Interpret/analyze data from multiple formats. Calculator allowed only in this section.",
    exams: ["GMAT"]
  },
  QuantitativeReasoning: {
    topics: [
      "Problem Solving (arithmetic, algebra, geometry, number properties, word problems)",
      "Data Sufficiency (determine if statements are sufficient to answer a question)"
    ],
    notes: "No calculators. Focus on mental math and estimation.",
    exams: ["GMAT", "CAT", "XAT", "NMAT", "IPMAT", "SSC", "Banking"]
  },
  VerbalReasoning: {
    topics: [
      "Reading Comprehension",
      "Critical Reasoning",
      "Sentence Correction (grammar, effective expression)"
    ],
    notes: "Covers main idea, inference, argument structure, grammar rules, idioms, etc.",
    exams: ["GMAT", "CAT", "XAT", "NMAT", "IPMAT", "CLAT"]
  }
};

// --- SSC Exams (CGL & CHSL) ---
syllabus.SSC = {
  QuantitativeAptitude: {
    topics: [
      "Arithmetic (ratio & proportion, percentages, profit/loss, discount, averages, mixtures, time & work, TSD, SI/CI, pipes & cisterns, boats/streams, trains, ages)",
      "Algebra (simplification, linear/quadratic equations, exponents, surds)",
      "Geometry (lines, angles, triangles, circles, polygons, coordinate geometry)",
      "Trigonometry (ratios, identities, equations, height & distance)",
      "Mensuration (area/perimeter of 2D, surface area/volume of 3D)",
      "Data Interpretation (tables, bar/pie/line graphs)"
    ],
    notes: "CGL is graduate level, CHSL is 12th level. Geometry/trigonometry is very important in CGL.",
    exams: ["SSC", "CGL", "CHSL", "CAT", "XAT", "NMAT", "IPMAT", "Banking"]
  },
  GeneralIntelligenceReasoning: {
    topics: [
      "Analogy & Classification",
      "Series (number, alphabet, pattern completion)",
      "Coding-Decoding",
      "Syllogisms",
      "Seating Arrangements & Puzzles",
      "Blood Relations, Directions, Order & Ranking",
      "Non-verbal reasoning (mirror/water images, paper folding, embedded figures)"
    ],
    exams: ["SSC", "CGL", "CHSL", "Banking"]
  },
  EnglishLanguage: {
    topics: [
      "Grammar & Vocabulary (error spotting, sentence improvement, fill in the blanks, one-word substitution, idioms/phrases, synonyms/antonyms, spelling)",
      "Reading Comprehension",
      "Sentence/phrase arrangements (para-jumbles)",
      "Cloze Test"
    ],
    exams: ["SSC", "CGL", "CHSL", "Banking"]
  },
  GeneralAwareness: {
    topics: [
      "Static GK (history, geography, polity, economy, science, art/culture)",
      "General Science (biology, physics, chemistry)",
      "Current Affairs (recent events, awards, sports, schemes, books/authors)",
      "Miscellaneous (computers, abbreviations, important days, national symbols)"
    ],
    notes: "SSC questions are direct and fact-based. Science and polity are often emphasized.",
    exams: ["SSC", "CGL", "CHSL"]
  }
};

// --- Banking Exams (IBPS, SBI PO/Clerk) ---
syllabus.Banking = {
  QuantitativeAptitude: {
    topics: [
      "Simplification/Approximation",
      "Number Series",
      "Data Interpretation (tables, bar/line/pie graphs, caselets)",
      "Arithmetic (profit/loss, time & work, TSD, SI/CI, ratio, mixture, ages, mensuration)",
      "Probability, quadratic equations, data sufficiency, mathematical inequalities"
    ],
    notes: "Speed and accuracy are crucial. DI and arithmetic dominate.",
    exams: ["Banking", "IBPS", "SBI", "SSC", "CAT", "XAT", "NMAT"]
  },
  ReasoningAbility: {
    topics: [
      "Puzzles & Seating Arrangements (linear, circular, floor, box, scheduling)",
      "Inequalities",
      "Syllogisms",
      "Coding-Decoding",
      "Blood Relations, Directions, Order & Ranking",
      "Alphanumeric Series/Sequence",
      "Logical reasoning (assumptions, conclusions, cause-effect, data sufficiency)"
    ],
    notes: "Puzzles are a large chunk. Systematic approach is key.",
    exams: ["Banking", "IBPS", "SBI", "SSC"]
  },
  EnglishLanguage: {
    topics: [
      "Reading Comprehension",
      "Cloze Test",
      "Para Jumbles",
      "Error Spotting/Sentence Correction",
      "Fill in the Blanks",
      "Vocabulary (synonym/antonym)"
    ],
    exams: ["Banking", "IBPS", "SBI", "SSC"]
  },
  GeneralAwareness: {
    topics: [
      "Current Affairs (last 6 months, economy, banking/finance, national events, appointments, awards, sports)",
      "Banking Awareness (monetary policy, RBI, banking terms, financial organizations, currencies, HQs, reforms, schemes, budget)",
      "Static GK (important days, books/authors, science, geography, polity)"
    ],
    exams: ["Banking", "IBPS", "SBI"]
  },
  ComputerAptitude: {
    topics: [
      "Basics of computers (parts, memory, software, internet, MS Office, keyboard shortcuts)",
      "Logic puzzles (flowcharts, keyboard codes)"
    ],
    notes: "Computer questions are fewer in recent exams.",
    exams: ["Banking", "IBPS", "SBI"]
  },
  DescriptiveTest: {
    topics: [
      "Essay writing (current topics, finance, social issues)",
      "Letter writing (formal/informal)"
    ],
    notes: "Only for PO exams. Practice structuring essays/letters within word limits.",
    exams: ["Banking", "IBPS", "SBI"]
  }
};

// --- UPSC Civil Services Examination (IAS Exam) ---
syllabus.UPSC = {
  Prelims: {
    GeneralStudies: {
      topics: [
        "History (Ancient, Medieval, Modern, Art & Culture)",
        "Geography (Physical, Indian, World)",
        "Polity (Constitution, Parliament, Judiciary, Governance)",
        "Economy (basic concepts, Indian economy, budget, schemes)",
        "Environment & Ecology (ecosystems, biodiversity, climate change, conservation)",
        "General Science & Technology (biology, physics, chemistry, IT, space, biotech, nanotech)",
        "Current Affairs (national/international events, awards, sports, summits, government initiatives)",
        "Miscellaneous (important days, books/authors, organizations, schemes)"
      ],
      notes: "Prelims is qualifying for Mains; strong grasp of both static and current topics required.",
      exams: ["UPSC"]
    },
    CSAT: {
      topics: [
        "Comprehension passages",
        "Logical reasoning and analytical ability",
        "Basic numeracy (class 10 math: numbers, LCM/HCF, percentages, ratios, algebra, geometry, data interpretation)",
        "Decision-making questions"
      ],
      notes: "CSAT is qualifying; practice for speed in comprehension and reasoning.",
      exams: ["UPSC"]
    }
  },
  Mains: {
    Essay: {
      topics: [
        "Essay writing (general, philosophical, current topics)"
      ],
      notes: "2 essays to be written; tests organization, clarity, and examples.",
      exams: ["UPSC"]
    },
    GeneralStudies1: {
      topics: [
        "Indian Heritage & Culture",
        "History (Modern India, World History)",
        "Indian Society (demographics, diversity, women's issues, poverty, urbanization)",
        "Geography (physical, industrial location, geophysical phenomena)"
      ],
      exams: ["UPSC"]
    },
    GeneralStudies2: {
      topics: [
        "Polity and Governance (Constitution, Parliament, Judiciary, policies, bureaucracy)",
        "International Relations (bilateral, global groupings, international institutions)",
        "Social Justice (health, education, welfare schemes)"
      ],
      exams: ["UPSC"]
    },
    GeneralStudies3: {
      topics: [
        "Economy (issues, budgeting, agriculture, industry, infrastructure, inclusive growth)",
        "Science & Tech (IT, space, robotics, biotech, government initiatives)",
        "Environment & Disaster Management",
        "Internal Security (terrorism, cyber security, border management)"
      ],
      exams: ["UPSC"]
    },
    GeneralStudies4: {
      topics: [
        "Ethics, Integrity, and Aptitude (theories, philosophers, public service values, corruption, case studies)"
      ],
      notes: "Tests personal attitude and ethics through theory and case studies.",
      exams: ["UPSC"]
    },
    OptionalSubjects: {
      topics: [
        "Any one optional subject (literature, history, geography, public administration, sociology, physics, etc.)"
      ],
      notes: "Two papers of chosen subject; requires deep knowledge.",
      exams: ["UPSC"]
    },
    LanguagePapers: {
      topics: [
        "English language paper",
        "Indian language paper (essay, comprehension, translation, grammar)"
      ],
      notes: "Qualifying only; marks not counted in merit.",
      exams: ["UPSC"]
    }
  },
  Interview: {
    topics: [
      "Current affairs, depth in optional subject, home state, personality traits, analytical thinking, leadership, communication, honesty, opinion on socio-economic issues"
    ],
    notes: "No defined syllabus; general awareness and personality assessment.",
    exams: ["UPSC"]
  }
};

// --- CLAT (Common Law Admission Test) ---
syllabus.CLAT = {
  EnglishLanguage: {
    topics: [
      "Reading Comprehension (main idea, inference, vocabulary, tone)",
      "Passages from fiction/non-fiction",
      "Inference and Conclusion",
      "Vocabulary in Context",
      "Tone and style"
    ],
    exams: ["CLAT"]
  },
  CurrentAffairsGK: {
    topics: [
      "Current Events (India/world)",
      "Static GK linked to current context (history, constitution, organizations, awards, science, etc.)",
      "Arts & Culture, International Affairs, Historical events of significance"
    ],
    exams: ["CLAT"]
  },
  LegalReasoning: {
    topics: [
      "Legal principles and facts",
      "Application of rules to facts",
      "Public policy or moral philosophical issues",
      "Reading and extracting rules from passages"
    ],
    notes: "No prior legal knowledge required; use principle given in passage.",
    exams: ["CLAT"]
  },
  LogicalReasoning: {
    topics: [
      "Short passages with critical reasoning questions",
      "Argument structure (premises, conclusions)",
      "Strengthen/weaken arguments",
      "Drawing inferences, assumptions, analogies, inconsistencies"
    ],
    exams: ["CLAT"]
  },
  QuantitativeTechniques: {
    topics: [
      "Short sets of facts/graphs/data",
      "Ratios and Proportions",
      "Basic Algebra",
      "Mensuration",
      "Statistical charts (pie, bar, etc.)"
    ],
    notes: "Numerical ability at Class 10 level; derive information from data and perform calculations.",
    exams: ["CLAT"]
  }
};

// --- JEE (Joint Entrance Examination) ---
syllabus.JEE = {
  Mathematics: {
    topics: [
      "Algebra (sets, relations, complex numbers, quadratic equations, matrices, determinants, binomial theorem, sequence/series, mathematical induction)",
      "Trigonometry (ratios, identities, equations, inverse trig, properties of triangles, height/distance)",
      "Coordinate Geometry (2D: lines, circles, conics; 3D: lines, planes, distance)",
      "Calculus (limits, continuity, differentiation, application of derivatives, integration, definite integrals, area under curves, differential equations)",
      "Vector Algebra (addition, scalar/dot product, cross product, geometric applications)",
      "Probability & Statistics (probability, distributions, mean, median, mode, standard deviation)",
      "Mathematical Reasoning (statements, truth values, logic)"
    ],
    exams: ["JEE", "CBSE12"]
  },
  Physics: {
    topics: [
      "Mechanics (units, kinematics, laws of motion, work/energy, rotational motion, gravitation, SHM, waves)",
      "Thermal Physics (thermodynamics, kinetic theory, calorimetry, heat transfer)",
      "Electricity & Magnetism (electrostatics, current, circuits, magnetism, electromagnetic induction, AC, EM waves)",
      "Optics (ray optics, wave optics, optical instruments)",
      "Modern Physics (photoelectric effect, atomic/nuclear physics, semiconductors, logic gates, communication systems)",
      "Experimental Skills (error analysis, graphical analysis, common experiments)"
    ],
    exams: ["JEE", "CBSE12"]
  },
  Chemistry: {
    topics: [
      "Physical Chemistry (mole concept, atomic structure, chemical bonding, thermodynamics, equilibrium, kinetics, electrochemistry, solutions, surface chemistry)",
      "Inorganic Chemistry (periodic table, s/p/d/f block, coordination compounds, metallurgy, environmental chemistry)",
      "Organic Chemistry (nomenclature, isomerism, reaction mechanisms, hydrocarbons, alcohols, aldehydes, acids, amines, biomolecules, polymers, chemistry in everyday life, named reactions)"
    ],
    exams: ["JEE", "CBSE12"]
  }
};

// --- NEET (National Eligibility cum Entrance Test) ---
syllabus.NEET = {
  Biology: {
    topics: [
      "Class 11: Diversity in Living World, Structural Organization in Plants/Animals, Cell Structure/Function, Plant Physiology, Human Physiology",
      "Class 12: Reproduction, Genetics/Evolution, Biology in Human Welfare, Biotechnology, Ecology/Environment"
    ],
    notes: "NCERT Biology textbooks are essential. Diagrams and factual recall are key.",
    exams: ["NEET", "CBSE12"]
  },
  Chemistry: {
    topics: [
      "Class 11: Basic Concepts, Atomic Structure, Periodic Table, Chemical Bonding, States of Matter, Thermodynamics, Equilibrium, Redox, Hydrogen, s-Block, basics of Organic, Hydrocarbons",
      "Class 12: Solid State, Solutions, Electrochemistry, Kinetics, Surface Chemistry, p/d/f-Block, Coordination Compounds, Haloalkanes/Haloarenes, Alcohols/Phenols/Ethers, Aldehydes/Ketones/Acids, Amines, Biomolecules, Polymers, Chemistry in Everyday Life"
    ],
    notes: "NCERT is key. Physical chemistry requires problem-solving; organic/inorganic need memorization.",
    exams: ["NEET", "CBSE12"]
  },
  Physics: {
    topics: [
      "Class 11: Units, Kinematics, Laws of Motion, Work/Energy, Rotational Motion, Gravitation, Properties of Matter, Thermodynamics, Oscillations, Waves",
      "Class 12: Electrostatics, Current Electricity, Magnetism, Electromagnetic Induction, AC, EM Waves, Optics, Modern Physics, Electronics, Communication Systems"
    ],
    notes: "Concepts and formula application are crucial. Practice MCQs for speed.",
    exams: ["NEET", "CBSE12"]
  }
};

// --- CBSE Academic Syllabus (Classes 10 & 12) ---
syllabus.CBSE10 = {
  Mathematics: {
    topics: [
      "Real Numbers (Euclid's Lemma, Fundamental Theorem, irrational numbers, decimals)",
      "Polynomials (zeros, relationship with coefficients, division algorithm)",
      "Pair of Linear Equations (solution methods, word problems)",
      "Quadratic Equations (roots, factorization, quadratic formula, applications)",
      "Arithmetic Progressions (nth term, sum, applications)",
      "Triangles (similarity, Pythagoras, Thales' theorem)",
      "Coordinate Geometry (distance, section formula, area of triangle)",
      "Trigonometry (ratios, identities, values, applications)",
      "Applications of Trigonometry (height/distance)",
      "Circles (tangent theorems, lengths)",
      "Constructions (division, similar triangles, tangents)",
      "Areas Related to Circles (sector, segment, combinations)",
      "Surface Areas and Volumes (cylinder, cone, sphere, cuboid, frustum)",
      "Statistics (mean, median, mode, ogive)",
      "Probability (classical definition, single events)"
    ],
    exams: ["CBSE10"]
  },
  Science: {
    topics: [
      "Physics: Light (reflection/refraction, lens/mirror formula, human eye, scattering), Electricity (Ohm's law, circuits, power), Magnetism, Sources of Energy",
      "Chemistry: Chemical Reactions, Acids/Bases/Salts, Metals/Non-Metals, Carbon Compounds, Periodic Table",
      "Biology: Life Processes, Control/Coordination, Reproduction, Heredity/Evolution, Environment, Natural Resources"
    ],
    exams: ["CBSE10"]
  }
};

syllabus.CBSE12 = {
  Mathematics: {
    topics: [
      "Relations and Functions, Inverse Trigonometric Functions",
      "Algebra (matrices, determinants)",
      "Calculus (continuity, differentiability, derivatives, integrals, area, differential equations)",
      "Vectors and 3D Geometry (direction cosines, lines, planes, distance)",
      "Linear Programming",
      "Probability (conditional, distributions, mean/variance)"
    ],
    exams: ["CBSE12"]
  },
  Physics: {
    topics: [
      "Electrostatics, Current Electricity, Magnetism, Electromagnetic Induction, AC, EM Waves, Optics, Dual Nature, Atoms, Nuclei, Semiconductors, Communication Systems"
    ],
    exams: ["CBSE12"]
  },
  Chemistry: {
    topics: [
      "Solid State, Solutions, Electrochemistry, Kinetics, Surface Chemistry, p/d/f-Block, Coordination Compounds, Haloalkanes/Haloarenes, Alcohols/Phenols/Ethers, Aldehydes/Ketones/Acids, Amines, Biomolecules, Polymers, Chemistry in Everyday Life"
    ],
    exams: ["CBSE12"]
  },
  Biology: {
    topics: [
      "Reproduction, Genetics/Evolution, Biology in Human Welfare, Biotechnology, Ecology/Environment"
    ],
    exams: ["CBSE12"]
  }
};

module.exports = syllabus; 