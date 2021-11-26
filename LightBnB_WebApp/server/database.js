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

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`SELECT * FROM users 
    WHERE email = $1;`,
    [email])
      .then((result) => result.rows[0])
      .catch((err) => err.message);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users 
    WHERE id = $1;`,
    [id])
      .then((result) => result.rows[0])
      .catch((err) => err.message);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`INSERT INTO users (
    name, email, password) 
    VALUES ( $1, $2, $3);`,
    [user.name, user.email, user.password])
      .then((result) => result.rows[0])
      .catch((err) => err.message);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
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
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
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
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
 
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

};
exports.addProperty = addProperty;
