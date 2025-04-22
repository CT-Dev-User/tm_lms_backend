import mongoose from 'mongoose';

// const payoutSchema = new mongoose.Schema({
//   instructorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processed', 'rejected'],
//     default: 'pending'
//   },
//   paymentType: {
//     type: String,
//     default: 'UPI'
//   },
//   dateRequested: {
//     type: Date,
//     default: Date.now
//   },
//   dateProcessed: Date
// });


// Update the status enum to include 'approved'
const payoutSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentType: {
    type: String,
    default: 'UPI'
  },
  dateRequested: {
    type: Date,
    default: Date.now
  },
  dateProcessed: Date
});

export default mongoose.model('Payout', payoutSchema);
