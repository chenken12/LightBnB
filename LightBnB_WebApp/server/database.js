const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

/// Users
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {
  getUserWithEmail: function(email) {
    return pool.query(`SELECT * FROM users 
      WHERE email = $1;`,
      [email])
        .then((result) => result.rows[0])
        .catch((err) => err.message);
  },
  getUserWithId: function(id) {
    return pool.query(`SELECT * FROM users 
      WHERE id = $1;`,
      [id])
        .then((result) => result.rows[0])
        .catch((err) => err.message);
  },
  addUser:  function(user) {
    return pool.query(`INSERT INTO users (
      name, email, password) 
      VALUES ( $1, $2, $3);`,
      [user.name, user.email, user.password])
        .then((result) => result.rows[0])
        .catch((err) => err.message);
  },
  getAllReservations: function(guest_id, limit = 10) {
    return pool.query(`
      SELECT properties.*, reservations.*, avg(rating) AS average_rating 
      FROM  reservations 
      JOIN properties ON properties.id = property_id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      HAVING now()::date > reservations.start_date
      LIMIT $2;`,
      [guest_id, limit])
        .then((result) => result.rows)
        .catch((err) => err.message);
  },
  getAllProperties: function (options, limit = 10) {
    // 1
    const queryParams = [];
    const optionsArr = [];
    // 2
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  
    // 3
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      optionsArr.push(`city LIKE $${queryParams.length} `);
    }
    if (options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night * 100}`);
      optionsArr.push(`cost_per_night >= $${queryParams.length} `);
    }
    if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night * 100}`);
      optionsArr.push(`city LIKE $${queryParams.length} `);
    }
    if (options.owner_id) {
      queryParams.push(`${options.owner_id}`);
      optionsArr.push(`owner_id = $${queryParams.length} `);
    }
    if (optionsArr.length > 0) { 
      optionsArr.forEach((option, index)=> {
        if (index > 0) {
          queryString += `AND `;
        } else {
          queryString += `WHERE `;
        }
        queryString += option;
      });
    }
  
    // 4
    const rating = options.minimum_rating || 0;
    queryParams.push(rating, limit);
    queryString += `
    GROUP BY properties.id
    HAVING avg(property_reviews.rating) >= $${queryParams.length - 1}
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  
    // 5
    console.log(queryString, queryParams);
  
    // 6
    return pool.query(queryString, queryParams).then((res) => res.rows);
  },
  addProperty: function(property) {
 
    const queryParams = [];
    const placeHolder = [];
  
    Object.values(property).forEach((values, index)=> {
      queryParams.push(values);
      placeHolder.push(`$${index+1}`);
    });
  
    let queryString = `
    INSERT INTO properties (${Object.keys(property).join()})
    VALUES(${placeHolder.join()})
    RETURNING *;`;
  
    console.log(queryString, queryParams);
  
    return pool.query(queryString, queryParams)
      .then(result => result.rows[0])
      .catch(err => console.error(err.message));
  
  }
};
