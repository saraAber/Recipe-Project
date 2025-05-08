const { AddCategoryDb, GetCategoryDb } = require('../reposetory/category');


const GetAllCategory = (_req, res) => {
    GetCategoryDb()
        .then(categories => res.send(categories))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}

const AddCategory = (req, res) => {
    const { Name } = req.body;
    if (!Name) {
        // לא נשלח מידע
        res.status(400)
        return res.send('לא נשלח שם לקטגוריה')
    };
    AddCategoryDb(Name)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}




module.exports = { GetAllCategory, AddCategory };