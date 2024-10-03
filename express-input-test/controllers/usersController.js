/* usersController.js*/
const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("userMail").isEmail(),
  body("userAge").isInt({ min: 18, max: 120 }),
  body("userBio").isLength({ max: 200 }),
];

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, userMail, userAge, userBio } = req.body;
    usersStorage.addUser({ firstName, lastName, userMail, userAge, userBio });
    res.redirect("/");
  },
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, userMail, userAge, userBio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      userMail,
      userAge,
      userBio,
    });
    res.redirect("/");
  },
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

// Render the search form or search results
exports.userSearch = (req, res) => {
  res.render("searchUser", { title: "Search User", users: null });
};

// Handle the search results
exports.userDisplaySearch = (req, res) => {
  const name = req.body.searchUser; // Get the name from the form submission
  if (name) {
    let foundUsers = usersStorage.searchUserByName(name); // Search for users by name
    return res.render("searchUser", {
      title: "Search User",
      users: foundUsers,
    });
  }
  // Render the search form if no name is provided
  res.render("searchUser", { title: "Search User", users: null });
};
