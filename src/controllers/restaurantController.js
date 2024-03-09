const { MongoClient } = require("mongodb"); // Import MongoClient

// Define your MongoDB URI
const uri = "mongodb://127.0.0.1:27017/eggyDB";

module.exports = function (app, resto) {
  app.get("/", function (req, resp) {
    resp.render("main", {
      layout: "index",
      title: "My Home page",
    });
  });

  app.get("/view-establishment.hbs", function (req, resp) {
    // Connect to MongoDB
    MongoClient.connect(uri)
      .then((client) => {
        console.log("Connected to MongoDB");
        const dbo = client.db("eggyDB"); // Get the database object
        const collName = dbo.collection("restaurants"); // Get the collection
        const cursor = collName.find({}); // Find all documents in the collection

        Promise.all([cursor.toArray()])
          .then(function ([restaurants]) {
            console.log("Data fetched successfully");
            // Split the displayRestos array into two arrays
            const restaurant_row1 = restaurants.slice(0, 3);
            const restaurant_row2 = restaurants.slice(3, 6);
            const restaurant_row3 = restaurants.slice(6);
            resp.render("view-establishment", {
              layout: "index",
              title: "View Establishments",
              restaurant_row1,
              restaurant_row2,
              restaurant_row3
            });
          })
          .catch(function (error) {
            console.error("Error fetching data:", error);
            resp.status(500).send("Error fetching data");
          })
          .finally(() => {
            client.close(); // Close the MongoDB client after fetching data
          });
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        resp.status(500).send("Error connecting to MongoDB");
      });
  });
};
