SELECT reservations.id AS id, title, cost_per_night, 
  reservations.start_date, avg(rating) AS average_rating
FROM reservations
JOIN properties ON properties.id = property_id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = '1'
GROUP BY reservations.id, properties.id
HAVING now()::date > reservations.start_date
ORDER BY reservations.start_date
LIMIT 10;
