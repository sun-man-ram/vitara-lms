import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // optional, helps avoid duplicate usernames
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['superAdmin', 'student', 'schoolAdmin'] // optional: restrict allowed values
    }
});

const User = mongoose.model('User', userSchema);

export default User;
