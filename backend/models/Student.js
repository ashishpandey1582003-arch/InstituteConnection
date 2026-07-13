import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    collegeRollNo: {
      type: String,
      required: [true, 'Please add a university name'],
      trim: true,
    },
    universityRollNo: {
      type: String,
      required: [true, 'Please add a university roll number'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    branch: {
      type: String,
      required: [true, 'Please specify your branch'],
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'MCA', 'MBA', 'AI/ML'],
    },
    year: {
      type: Number,
      required: [true, 'Please specify your year'],
      enum: [1, 2, 3, 4],
    },
    section: {
      type: String,
      required: [true, 'Please specify your section'],
    },
    mobileNo: {
      type: String,
      required: [true, 'Please add a mobile number'],
    },
    cgpa: {
      type: Number,
      required: [true, 'Please specify your CGPA'],
      min: [0, 'CGPA cannot be less than 0'],
      max: [10, 'CGPA cannot be greater than 10'],
    },
    resume: {
      type: String, // Path to uploaded resume
    },
    photo: {
      type: String, // Path to profile picture
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      default: 'student',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
