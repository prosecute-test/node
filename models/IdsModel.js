const mongoose = require('mongoose');

const idsSchema = new mongoose.Schema({
    user_id: Number,
    role_id: Number,
    menu_id: Number
});

const IdsModule = mongoose.model('Ids', idsSchema);

IdsModule.findOne((err, data) => {
    if (!data) {
        const newIds = new IdsModule({
            user_id: 0,
            role_id: 0,
            menu_id: 0
        });
        newIds.save();
    }
})


module.exports = IdsModule;