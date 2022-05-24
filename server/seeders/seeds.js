
const faker = require("faker");

const db = require("../config/connection");
const { Review, User } = require("../models");

db.once("open", async () => {
  //await Review.deleteMany({});
  //await User.deleteMany({});


  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    userData.push({ username, email, password });
  }

  const createdUsers = await User.collection.insertMany(userData);


  let createdReviews = [];
  for (let i = 0; i < 100; i += 1) {
    const reviewsText = faker.lorem.words(Math.round(Math.random() * 20) + 1);


    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { username, _id: userId } = createdUsers.ops[randomUserIndex];


    const createdReviews = await Review.create({ reviewsText, username });   const createdReview = await Review.create({ reviewsText, username });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { Reviews: createdReview._id } }
    );

    createdReviews.push(createdReview);
  }

  for (let i = 0; i < 100; i += 1) {
    const reactionBody = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { username } = createdUsers.ops[randomUserIndex];

    const randomReviewIndex = Math.floor(Math.random() * createdReviews.length);
    const { _id: reviewId } = createdReviews[randomReviewIndex];

    await Review.updateOne(
      { _id: reviewId },
      { $push: { reactions: { reactionBody, username } } },
      { runValidators: true }
    );
  }

  console.log("all done!");
  process.exit(0);
});