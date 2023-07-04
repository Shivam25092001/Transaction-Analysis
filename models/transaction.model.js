import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    id :{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    user:{
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    software:{
        type: String,
        required: true,
    },
    seats:{
        type: Number,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    }
});

export default mongoose.model('Transaction', transactionSchema);