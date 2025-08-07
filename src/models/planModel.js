import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planTitle: {
        type: String,
        required: true,
        enum: ["Quarterly Plan", "Half Yearly Plan", "Annual Plan"],
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    listings: {
        type: Number,
        required: true,
    },
    premiumBadging: {
        type: Number,
        required: true,
    },
    shows: {
        type: Number,
        required: true,
    },
    emi: {
        type: Boolean,
        default: false,
    },
    saleAssurance: {
        type: Boolean,
        default: false,
    },
    socialMedia: {
        type: Boolean,
        default: false,
    },
    moneyBack: {
        type: mongoose.Schema.Types.Mixed,
        default: false,
    },
    teleCalling: {
        type: Boolean,
        default: false,
    },
    pricePaid: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
    },
    note: {
        type: String,
    },
    planDetailsSnapshot: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

planSchema.index({ userId: 1, expiryDate: 1 });

const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);

export default Plan;
