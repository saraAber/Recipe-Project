const Category = require('../model/category')

const GetCategoryDb = () => {
    return Category.findAll();
}

const AddCategoryDb = (Name) => {
  return  Category.create({ Name })
}

module.exports = { GetCategoryDb, AddCategoryDb }