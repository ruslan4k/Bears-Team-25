const axios = require("axios");
var passport = require("passport");
var express = require("express");
var router = express.Router();
var User = require("../models/users");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("You are not logged in!");
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: false, status: "You are not logged in!" });
  }
}

API_KEY = JSON.parse(process.env.trello).consumerKey;

router.get(
  "/auth",
  passport.authorize("trello", {
    scope: {
      read: "true",
      write: "true"
    },
    expiration: "never",
    name: "AutoApplet"
  })
);

router.get(
  "/auth/callback",
  passport.authenticate("trello", {
    failureRedirect: "http://localhost:3000/"
  }),
  (req, res) => res.redirect("http://localhost:3000/") // Successful authentication, redirect home.
);

router.get("/fetchBoards", isLoggedIn, (req, res, next) => {
  var token = req.user.trello.token;
  axios
    .get(
      "https://api.trello.com/1/member/me/boards/?actions=all" +
        `,url&key=${API_KEY}&token=${token}`
    )
    .then(response => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        boards: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

const fetchListsOfBoard = (token, boardID) =>
  axios.get(
    `https://api.trello.com/1/boards/${boardID}/lists?actions=all` +
      `,url&key=${API_KEY}&token=${token}`
  );

const createList = (token, listName, boardID) =>
  axios.post(
    "https://api.trello.com/1/lists" + `?url&key=${API_KEY}&token=${token}`,
    {
      name: listName,
      idBoard: boardID
    }
  );

const postCard = (token, cardTitle, listID, position, description) =>
  axios.post(
    "https://api.trello.com/1/cards" + `?url&key=${API_KEY}&token=${token}`,
    {
      name: cardTitle,
      idList: listID,
      pos: position,
      desc: description
    }
  );

router.post("/saveTrelloConfig", isLoggedIn, (req, res, next) => {
  var user = req.user;
  var {listName, cardTitle, position, boardID, description}  = req.body;
  user.trello = {...user.trello, listName, cardTitle, position, boardID, description };
  user.save(function(err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({status: "Configuration successfully saved" });
    return;
  });
});

router.post("/postCard", isLoggedIn, (req, res, next) => {
  token = req.user.trello.token;
  var {listName, cardTitle, position, boardID, description}  = req.body

  async function logic() {
    try {
      const lists = (await fetchListsOfBoard(token, boardID)).data;
      listID = null;
      // if board contains provided listName, add a new card there
      if ( lists.some(element => {
          id = element.id;
          return element.name === listName;
        })) {
      listID = id
      }
      // if board doesn't containt provided listName, create new list with provided name 
      // to add card there
      else {
        listID = (await createList(token, listName, boardID)).data.id;
      }
      let newCard = (await postCard(token, cardTitle, listID, position, description)).data;
      //console.log(newCard)
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({newCard});
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
  logic();
});


async function postCardLogic(trelloConfig) {
  try {
    const lists = (await fetchListsOfBoard(trelloConfig.token, trelloConfig.boardID)).data;
    listID = null;
    // if board contains provided listName, add a new card there
    if ( lists.some(element => {
        id = element.id;
        return element.name === trelloConfig.listName;
      })) {
    listID = id
    }
    // if board doesn't containt provided listName, create new list with provided name 
    // to add card there
    else {
      listID = (await createList(trelloConfig.token, trelloConfig.listName, trelloConfig.boardID)).data.id;
    }
    let newCard = (await postCard(trelloConfig.token, trelloConfig.cardTitle, listID,
       trelloConfig.position, trelloConfig.description)).data;
    return newCard
    //console.log(newCard)

  } catch (err) {
    console.log(err);
    return next(err);
  }
}

exports.trelloRouter = router;
exports.postCard = postCardLogic;
