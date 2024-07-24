import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, require: true, unique: true},
  password: { type: String, required: true },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users this user is following
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

export default mongoose.models.User || mongoose.model('User', userSchema);
