INSERT INTO users (
  name, email, password) 
  VALUES (
  'Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
  name, email, password) 
  VALUES (
  'Louisa Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
  name, email, password) 
  VALUES (
  'Dominic Parks ', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
    VALUES (
      'Speed lamp', 'description', 1, 
      'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 
      'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 
      930.61, 6, 4, 8, true, 'Quebec', 'Sotboske', 'Canada', '536 Namsub Highway', '28142');
INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
    VALUES (
      'Blank corner ', 'description', 1, 
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 ', 
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 
      852.34, 6, 2, 1, true, 'Alberta', 'Bohbatev', 'Canada', '651 Nami Road', '85234');
INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
    VALUES (
      'Habit mix ', 'description', 2, 
      'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 
      'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 
      460.58, 0, 5, 6, true, 'Newfoundland And Labrador', 'Genwezuj', 'Canada', '1650 Hejto Center', '44583');

INSERT INTO reservations (
  guest_id, property_id, start_date, end_date) 
  VALUES (
  3, 2, '2018-09-11', '2018-09-26');
INSERT INTO reservations (
  guest_id, property_id, start_date, end_date) 
  VALUES (
  2, 2, '2019-01-04', '2019-02-01');
INSERT INTO reservations (
  guest_id, property_id, start_date, end_date) 
  VALUES (
  1, 1, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (
  guest_id, property_id, reservation_id, rating, message) 
  VALUES (
  2, 2, 1, 3, 'messages');
INSERT INTO property_reviews (
  guest_id, property_id, reservation_id, rating, message) 
  VALUES (
  2, 2, 2, 4, 'messages');
INSERT INTO property_reviews (
  guest_id, property_id, reservation_id, rating, message) 
  VALUES (
  1, 1, 3, 4, 'messages');