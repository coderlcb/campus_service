/* 处理用户操作 */
const Router = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { register,
    emailRegister,
    getUserByUid,
    getAvatarInfo,
    updateUserInfo,
    updatePassword,
    getUserRightByUsername,
    getVerifyStatusByUid,
    saveStudentInfo,
    getUserBalanceAndPayPasswordByUid,
    getUserAddress,
    addAddress,
    changeDefaultAddress,
    getReceiver } = require('../controller/user.controller')
const userRouter = new Router({ prefix: '/user' })

userRouter.post('/register', verifyUser, handlePassword, register)

//用户提交邮箱注册信息
userRouter.post('/emailRegister',handlePassword, emailRegister)

userRouter.get('/getUserByUid', getUserByUid)

userRouter.get('/:id/avatar', getAvatarInfo)

userRouter.post('/updateUserInfo', verifyAuth, updateUserInfo)
//修改密码
userRouter.post('/updatePassword', verifyAuth, handlePassword, updatePassword)

userRouter.get('/getUserRightByUsername', getUserRightByUsername)

userRouter.post('/submitStudentInfo', verifyAuth, saveStudentInfo)

userRouter.get('/getVerifyStatusByUid', getVerifyStatusByUid)

userRouter.get('/getUserBalanceAndPayPasswordByUid', getUserBalanceAndPayPasswordByUid)

userRouter.post('/addAddress', verifyAuth, addAddress)
userRouter.get('/getUserAddress', verifyAuth, getUserAddress)

userRouter.post('/changeDefaultAddress', changeDefaultAddress)
//获取代跑用户
userRouter.get('/getReceiver', getReceiver)
module.exports = userRouter