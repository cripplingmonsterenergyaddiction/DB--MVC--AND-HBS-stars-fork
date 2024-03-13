const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/eggyDB";

module.exports = function (app, resto) {
  app.get("/", function (req, resp) {
    resp.render("main", {
      layout: "index",
      title: "My Home page",
    });
  });
  
  // New API endpoint for fetching filtered restaurants
  app.get("/api/restaurants", function (req, resp) {
    MongoClient.connect(uri)
      .then((client) => {
        console.log("Connected to MongoDB");
        const dbo = client.db("eggyDB");
        const collName = dbo.collection("restaurants");
        const { stars } = req.query;

        let filter = {};
        if (stars) {
          const selectedRatings = Array.isArray(stars) ? stars.map(Number) : [Number(stars)];
          const ratingFilters = selectedRatings.map(selectedRating => {
            const minRating = selectedRating;
            const maxRating = selectedRating + 1;
            return { main_rating: { $gte: minRating, $lt: maxRating } };
          });
          filter = { $or: ratingFilters };
        }

        const cursor = collName.find(filter);

        cursor.toArray()
          .then(function (restaurants) {
            console.log("Data fetched successfully");
            resp.json({ restaurants });
          })
          .catch(function (error) {
            console.error("Error fetching data:", error);
            resp.status(500).json({ error: "Error fetching data" });
          })
          .finally(() => {
            client.close();
          });
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        resp.status(500).json({ error: "Error connecting to MongoDB" });
      });
  });
};
