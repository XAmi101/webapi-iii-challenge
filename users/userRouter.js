const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();


//Creates a new user 
router.post('/', validateUser, (req, res) => {
   const update = req.body
    Users
    .insert(update)
    .then(userNew => res.status(201).json(userNew))
    .catch(() =>
        res.status(500).json({ errorMessage: "unable to add the user in the database" })
      );
});

//Creates a new user for given id
router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
    const update = {...req.body, user_id: req.params.id};

    Posts.insert(update)
    .then(posts => {
      if (posts) {
        res.status(201).json(posts);
      } else {
        res.status(404).json({ errorMessage: "User with that id does not exist" });
      }
    })
    .catch(() =>
      res.status(500).json({
        error: "unable to add the user in the database"
      })
    );
});

router.get('/', (req, res) => {
    Users.get()
        .then(user => res.status(200).json(user))
        .catch(() => res.status(500).json({ error: "unable to retrieve Users" }));
}); 

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id

    Users.getById(id)
    .then(user => res.status(200).json(user))
    .catch(() =>
      res.status(500).json({ errorMessage: "unable to retrieve User with given id" })
    );
});

//get all the posts from a given id/user
router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.params.id
    
    Users.getUserPosts(id)
    .then(user => res.status(200).json(user))
    .catch(() =>
      res.status(500).json({ errorMessage: "unable to retrieve posts with given id/user" })
    );

    // .then(posts => {
    //     if (posts.length > 0) {
    //       res.status(200).json(posts);
    //     } else {
    //       res.status(200).json({ userPosts: "There are no posts on this user" });
    //     }
    //   })
    //   .catch(() =>
    //     res.status(500).json({ errorMessage: "Couldn't retrieve users Posts" })
    //   );
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id

    Users.remove(id)
    .then(user => res.status(200).json({ message: 'The post has been deleted' }))
    .catch(() =>
      res
        .status(500)
        .json({ error: "Unable to delete user" })
    );
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const id = req.params.id
    const changes = req.body;

    Users.update(id, changes)
    .then(user => res.status(200).json(user))
    .catch(() =>
      res.status(500).json({ errorMessage: "User could not be updated" })
    );


});

//custom middleware

function validateUserId(req, res, next) {
    const idNew = req.params.id
    console.log(idNew);
    const changesNew = req.body;
    console.log(changesNew);

    Users.getById(id).then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(400).json({ message: "invalid user id" });
        }
      });

//       const id = req.headers.id;
//       const userid = users.getById(id);

//       if (!idNew || !changesNew) {
//         return res.status(401).json({ message: "Oh noes!!!"})
//      } 
//      next();
//  };
};

function validateUser(req, res, next) {
      const changes = req.body;

    if (changes) {
        if(!changes.name) {
            res.status(400).json({message: "missing name field"})
        } else {
            res.json(changes)
        }
    } else {
        res.status(400).json({ message: "missing user data"})
    }
    next();
};

function validatePost(req, res, next) {
      
    const changeVal = req.body;
       
    if (changeVal) {
        if(!changeVal.text) {
            res.status(400).json({message: "missing post field"})
        } else {
         res.status(400).json({ message: "missing required text field"})
        }
    } else {
        next();
    }   
         // if (!changeVal) {
        //     res.status(400).json({message: "missing post data"})
        // } else if (!changeVal.text) {
        //     res.status(400).json({message: "missing required text field"})
        // }
        // next();
        
};

module.exports = router;
