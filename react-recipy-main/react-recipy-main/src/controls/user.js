const { LoginDb, SighinDb } = require("../reposetory/user");

const Login = (req, res) => {
    const { UserName, Password } = req.body;
    LoginDb(UserName, Password)
        .then(findUser => {
            if (findUser) {
                return res.send(findUser)
            }
            return res.status(401).send('user not found!');

        })
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}

const Sighin = (req, res) => {
    const { UserName, Password, Name, Phone, Email, Tz } = req.body;

    if (!UserName || !Name || !Password || !Phone || !Email || !Tz) {
        // לא נשלח מידע
        return res.status(400).send('לא מולאו כל הפרטים')
    };
    SighinDb({ UserName, Password, Name, Phone, Email, Tz })
        .then(newUser => res.send(newUser))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}
const GetAllUser = (_req, res) => {
    GetUserDb()
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}

module.exports = { Login, Sighin ,GetAllUser};