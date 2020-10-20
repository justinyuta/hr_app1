// Update by VS 2020/10/19 change to procee env variable 
module.exports = {
    database: {
        user: process.env.HR_USER,
        password: process.env.HR_PASSWORD,
        connectString: process.env.HR_CONNECTIONSTRING
    },
    jwtSecretKey: "jmvhDdDBMvqb=M@6h&QVA7x"
};
