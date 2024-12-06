const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors,places } = require('./seedHelpers');
const cities = require('./cities');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    //useNewUrlParser : true,
    //useCreateIndex : true,
    //useUnifiedTopology : true
  });
  console.log("Database connected");
}

const db = mongoose.connection;
let sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '67239874c0965a42c0a41667',
      location : `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
        ]
    },
      images: [
        {
          url: 'https://res.cloudinary.com/doqlizfwx/image/upload/v1733503889/YelpCamp/rxhjahymudmqcm5dnwdn.jpg',
          filename: 'YelpCamp/rxhjahymudmqcm5dnwdn',
        },
        {
          url: 'https://res.cloudinary.com/doqlizfwx/image/upload/v1733503891/YelpCamp/jmrwzek5jfuv0e6qgct0.jpg',
          filename: 'YelpCamp/jmrwzek5jfuv0e6qgct0',
        }
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam qui quaerat nulla at veritatis expedita dolorum, repellat quia vero nesciunt! Nam provident commodi maiores, odit molestias atque ab nemo quas!',
      price
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})

