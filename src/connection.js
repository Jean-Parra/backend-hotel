const mongoose = require('mongoose')

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://usuario_upb:contrasena_upb@cluster0.ya3bz0q.mongodb.net/hotelupb?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db =>
        console.log('MongoDB connection established.')
    )
    .catch((error) => console.log("MongoDB connection failed:", error.message))