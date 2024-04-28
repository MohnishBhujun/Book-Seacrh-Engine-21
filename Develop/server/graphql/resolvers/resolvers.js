const User = require("../../models/User");
const { AuthenticationError } = require("apollo-server-express");
const { generateToken } = require("../../utils/tokenUtils");

module.exports = {
  Mutation: {
    signup: async (__, { username, email, password }) => {
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        throw new AuthenticationError("User already exists");
      }
      const user = await User.create({ username, email, password });
      const token = generateToken(user);
      return { token, user };
    },
    login: async (__, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = generateToken(user);
      return { token, user };
    },

    addBook: async (_, { bookData }, context) => {
      try {
        if (!context.userData) {
          throw new AuthenticationError("Unauthorized");
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.userData._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (error) {
        throw new Error("Failed to add book");
      }
    },

    removeBook: async (_, { bookId }, context) => {
      try {
        if (!context.userData) {
          throw new AuthenticationError("Unauthorized");
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.userData._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("User not found");
        }
        return updatedUser;
      } catch (error) {
        throw new Error("Failed to remove book");
      }
    },
  },

  Query: {
    me: async (__, _, context) => {
      if (!context.userData) {
        throw new AuthenticationError("Unauthorized");
      }
      if (context.userData) {
        const userData = await User.findOne({
          _id: context.userData._id,
        }).select("-__v -password");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },

    getUserBooks: async (_, __, context) => {
      try {
        if (!context.userData) {
          throw new AuthenticationError("Unauthorized");
        }
        const user = await User.findById(context.userData._id);
        return user.savedBooks;
      } catch (error) {
        throw new Error("Failed to fetch user's books");
      }
    },
  },
};
