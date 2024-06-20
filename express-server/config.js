const config = {
    port: 8888,
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: "3306",
        database: 'st_edu',
    },
    defaultAvatar: 'http://file.wwywwy.top/FrKwEmE-0z5Ise5BjiINVdAocn6N',
    jwt: { secret: 'SJNDWKNKLADNALKWNWJLK', expiresIn: '10h' }
}

module.exports = config
