const Bay = require("../model/bay");

const GetMyListDb = (UserId) => {
    return Bay.findAll({ where: { UserId } })
}

const AddToListDb = async (Name, UserId, Count) => {
    const bay = await Bay.findOne({ where: { Name, UserId } });
    if (bay) {
        return bay.update({ Count: bay.Count + Count })
    }
    else {
        return Bay.create({ Name, UserId, Count })
    }

}

const DeleteDb = (Id) => {
    return Bay.destroy({ where: { Id } })
}

module.exports = { GetMyListDb, DeleteDb, AddToListDb };