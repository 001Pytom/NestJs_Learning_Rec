const { DataSource } = require('typeorm');

module.exports = new DataSource({
  type: 'postgres',
  host: 'localhost', // or 'db' if running inside Docker
  port: 5432,
  username: 'postgres',
  password: 'pass123', // ✅ match this to docker-compose
  database: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
