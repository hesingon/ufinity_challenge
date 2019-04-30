const config = {
    'test': {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'test',
    },
    'development': {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'ufinity',
    }
};

module.exports = config[process.env.NODE_ENV];