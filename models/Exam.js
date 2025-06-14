const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  sections: [{
    name: { 
      type: String, 
      required: true,
      enum: ['Quant', 'VARC', 'LRDI', 'DI', 'GA']
    },
    timeLimit: { 
      type: Number, 
      required: true 
    },
    marksPerQuestion: { 
      type: Number, 
      default: 1 
    },
    negativeMarking: { 
      type: Number, 
      default: 0.25 
    }
  }],
  price: { 
    type: Number, 
    default: 0 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);