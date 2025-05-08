const User = require('../model/user')

const LoginDb = (UserName, Password) => {

    return User.findOne({ where: { UserName, Password } });
}

const SighinDb = (user) => {
    return User.create(user)
}

const GetUserDb = () => {
    return User.findAll({ });
}

module.exports = { LoginDb, SighinDb ,GetUserDb};