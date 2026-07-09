import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    logo: {
      type: String, // Logo image file path
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    jobRole: {
      type: String,
      required: [true, 'Please specify the job role'],
      trim: true,
    },
    jobType: {
      type: String,
      required: [true, 'Please specify job type'],
      enum: ['Full-time', 'Internship', 'Both'],
    },
    packageCTC: {
      type: Number, // LPA
      required: [true, 'Please specify CTC in LPA'],
    },
    stipend: {
      type: Number, // Monthly stipend in INR (optional)
      default: 0,
    },
    eligibilityCriteria: {
      type: String,
      trim: true,
    },
    minCGPA: {
      type: Number,
      required: [true, 'Please specify minimum CGPA required'],
      min: 0,
      max: 10,
    },
    allowedBranches: {
      type: [String],
      required: [true, 'Please specify allowed branches'],
    },
    allowedPassingYear: {
      type: Number,
      required: [true, 'Please specify allowed passing year'],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    selectionProcess: {
      type: String, // Detailed rounds/description
      trim: true,
    },
    numRounds: {
      type: Number,
      default: 1,
    },
    interviewMode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Offline',
    },
    interviewLocation: {
      type: String, // Location if offline or hybrid
      trim: true,
    },
    regStartDate: {
      type: Date,
      required: [true, 'Please specify registration start date'],
    },
    regEndDate: {
      type: Date,
      required: [true, 'Please specify registration end date'],
    },
    driveDate: {
      type: Date,
      required: [true, 'Please specify drive date'],
    },
    resultDate: {
      type: Date,
    },
    website: {
      type: String,
      trim: true,
    },
    hrName: {
      type: String,
      trim: true,
    },
    hrEmail: {
      type: String,
      trim: true,
    },
    hrContact: {
      type: String,
      trim: true,
    },
    pdfNotification: {
      type: String, // Path to PDF
      default: '',
    },
    brochure: {
      type: String, // Path to Brochure
      default: '',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Registration Open', 'Closed', 'Completed'],
      default: 'Upcoming',
    },
    prepMaterial: {
      interviewPrep: { type: String, default: '' },
      prevQuestions: { type: [String], default: [] },
      codingQuestions: { type: [String], default: [] },
      aptitudeTopics: { type: [String], default: [] },
      hrQuestions: { type: [String], default: [] },
      resources: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
