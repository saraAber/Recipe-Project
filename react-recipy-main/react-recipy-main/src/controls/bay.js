const { GetMyListDb, AddToListDb, DeleteDb } = require("../reposetory/bay");

const GetMyList = (req, res) => {
    const { UserId } = req.params;
    GetMyListDb(UserId)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}

const AddToList = (req, res) => {
    const { Name, UserId, Count } = req.body;

    if (!Name || !UserId || !Count) {
        // לא נשלח מידע
        return res.status(400).send('לא נשלח שם מוצר או כמות תקינה או שם משתמש')
    };
    AddToListDb(Name, UserId, Count)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors && err.errors.length) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)
        })
}

const Delete = (req, res) => {
    const { Id } = req.params;
    DeleteDb(Id)
        .then(x => res.send('ok'))
        .catch(err => {
            if (err?.errors && err.errors.length) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)
        }
        )

}

module.exports = { GetMyList, AddToList, Delete };