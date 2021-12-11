const { Pool } = require("pg");
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }
  
  async verifyNewUsername(username) {
    const query = {
      text: 'select username from users where username = $1',
      values: [username]
    }

    const result = await this._pool.query(query);

    if(result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan');
    }
  }

  async addUser({username, password, fullname}) {
    await this.verifyNewUsername(username);
    
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING ID",
      values: [id, username, hashedPassword, fullname]
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: 'select id, username, fullname FROM users WHERE id = $1',
      values: [userId]
    }

    console.error(query);

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = UsersService;