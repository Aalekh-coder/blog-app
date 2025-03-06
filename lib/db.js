import { connect } from "mongoose";

const connectToDatabase = async () => {
  connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((e) => console.log(e));
};

export default connectToDatabase;
