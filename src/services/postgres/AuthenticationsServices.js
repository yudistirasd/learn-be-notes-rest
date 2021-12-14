const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AuthenticationsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'insert into authentications values($1)',
      values: [token]
    }

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'select token from authentications where token = $1',
      values: [token]
    }
    // console.log(query);
    const result = await this._pool.query(query);

    console.log(result.rows.length);

    if(!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'delete from authentications where token = $1',
      values: [token]
    }

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsServices;