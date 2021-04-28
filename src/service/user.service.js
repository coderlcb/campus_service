const connection = require('../app/database')

class UserService {
    //用户注册信息插入数据库
    async register (user) {
        const { username, password } = user
        const statement = 'INSERT INTO `user` (`username`,`password`) VALUES (?,?)'

        const result = await connection.execute(statement, [username, password])

        //返回结果
        return result[0]
    }
    //保存用户邮箱和验证码
    async saveEmailCode (email, code) {
        const statement = 'INSERT INTO `email_code` (`email`,`code`) VALUES (?,?)'
        const [result] = await connection.execute(statement, [email, code])

        //返回结果
        return result[0]
    }
    //验证码有效时间到期，删除记录
    async deleteCode (email) {
        const statement = 'DELETE FROM `email_code` WHERE `email` = ?'
        await connection.execute(statement, [email])
    }
    //获取用户邮箱验证码
    async getVerifyCode (username) {
        const statement = 'SELECT `code` FROM `email_code` WHERE `email` = ?'
        const [result] = await connection.execute(statement, [username])
        console.log(result[0])
        return result[0]
    }
    //通过用户id查询数据库
    async getUserByUid (uid) {
        const statement = 'SELECT * FROM `user` WHERE `uid` = ?'
        const [result] = await connection.execute(statement, [uid])
        return result[0]
    }
    //通过用户名查询是否有记录
    async getUserByUserame (username) {
        const statement = 'SELECT * FROM `user` WHERE `username` = ?'
        const [result] = await connection.execute(statement, [username])
        return result[0]
    }
    //通过用户名查询用户权限
    async getUserRightByUsername (username) {
        const statement = 'SELECT `right` FROM `user` WHERE `username` = ?'
        const [result] = await connection.execute(statement, [username])
        return result[0]
    }
    //更新用户头像地址
    async updateUserAvatarUrl (avatarUrl, userId) {
        const statement = 'UPDATE `user` SET `avatar_url` = ? WHERE `uid` = ?'
        const result = await connection.execute(statement, [avatarUrl, userId])

        return result[0]
    }
    //获取用户密码
    async getUserOldPassword (uid) {
        const statement = 'SELECT `password` FROM `user` WHERE `uid` = ?'
        const [result] = await connection.execute(statement, [uid])
        return result[0]
    }
    //更新用户密码
    async updatePassword (uid, new_pwd) {
        const statement = 'UPDATE `user` SET `password` = ? WHERE `uid` = ?'
        const result = await connection.execute(statement, [new_pwd, uid])

        return result[0]
    }
    //更新用户信息
    async updateUserInfo (username, nickname, gender, telephone, brithday) {
        const statement = 'UPDATE `user` SET `nickname` = ? ,`gender` = ? ,`telephone` = ? , `brithday` = ? WHERE `username` = ?'
        const [result] = await connection.execute(statement, [nickname, gender, telephone, brithday, username])
        return result

    }
    //通过uid查找是否有学生信息下记录
    async selectStudentInfoByUid (uid) {
        const statement = 'SELECT 1 FROM `user_student_info` WHERE `user_id` = ? LIMIT 1'
        const [result] = await connection.execute(statement, [uid])

        return result[0]
    }
    //通过学生id获取学生信息审核状态
    async getVerifyStatusByUid (uid) {
        const statement = 'SELECT `audit_status` FROM `user_student_info` WHERE `user_id` = ?'
        const [result] = await connection.execute(statement, [uid])

        return result[0]
    }
    //通过uid获取用户余额和支付密码
    async getUserBalanceAndPayPasswordByUid (uid) {
        const statement = 'SELECT `balance`,`pay_password` FROM `user` WHERE `uid` = ?'
        const [result] = await connection.execute(statement, [uid])

        return result[0]
    }
    //保存用户学生信息
    async saveStudentInfo (user_studentInfo) {
        const statement = 'INSERT INTO `user_student_info` (`name`,`id_number`,`province`,`university_name`,`education_background`,`student_number`,`enrollment_year`,`user_id`) VALUES (?,?,?,?,?,?,?,?)'
        const result = await connection.execute(statement, [user_studentInfo.name, user_studentInfo.id_number, user_studentInfo.province, user_studentInfo.university_name, user_studentInfo.education_background, user_studentInfo.student_number, user_studentInfo.enrollment_year, parseInt(user_studentInfo.uid)])
        return result[0]

    }
    //获取用户收件地址
    async getUserAddress (uid) {
        const statement = 'SELECT * FROM `user_address` WHERE `user_id` = ?'
        const [result] = await connection.execute(statement, [uid])

        return result
    }
    //新增用户收件地址,user_address为对象
    async addAddress (user_address) {
        const statement = 'INSERT INTO `user_address` (`realname`,`telephone`,`university_name`,`address_details`,`isDefault`,`user_id`) VALUES (?,?,?,?,?,?)'
        const [result] = await connection.execute(statement, [user_address.realname, user_address.telephone, user_address.university_name, user_address.address_details, user_address.isDefault, user_address.uid])
        return result
    }
    //改变用户默认收件地址
    async changeDefaultAddress (default_address_id, user_id) {
        //判断用户是否已设置默认地址
        const judgeStatement = 'SELECT 1 FROM `user_address` WHERE `user_id` = ? AND `isDefault` = 1 LIMIT 1'
        const judgeResult = await connection.execute(judgeStatement, [user_id])
        if (!judgeResult) {
            //用户没有旧的默认地址
            const createDefaultStatement = 'UPDATE `user_address` SET `isDefault` = 1 WHERE `id` = ? AND `user_id` = ?'
            const [createResult] = await connection.execute(createDefaultStatement, [default_address_id, user_id])

            return createResult
        } else {
            //用户有旧的默认地址先将旧的默认地址置为非默认
            const changeOldStatement = 'UPDATE `user_address` SET `isDefault` = 0 WHERE `user_id` = ? AND `isDefault` = 1'
            await connection.execute(changeOldStatement, [user_id])
            const createDefaultStatement = 'UPDATE `user_address` SET `isDefault` = 1 WHERE `id` = ? AND `user_id` = ?'
            const [createResult] = await connection.execute(createDefaultStatement, [default_address_id, user_id])

            return createResult
        }


    }
    //通过tid查找代跑用户id
    async getReceiver (tid) {
        const statement = 'SELECT `receiver_id` FROM `user_receive_task` WHERE `tid` = ?'
        const [result] = await connection.execute(statement, [tid])
        return result[0]
    }
}

module.exports = new UserService()