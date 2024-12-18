import mongoose from 'mongoose';

const SharedTextSchema = new mongoose.Schema({
    content: {
        type: String,
        // required: [true, 'Content is required'], // Clearer error message
        default: function () { return ''; } // Function ensures default is applied properly
    },
});

const SharedText = mongoose.model('SharedText', SharedTextSchema);

export default SharedText;
