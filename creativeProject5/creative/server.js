// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;



app.post('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.status(400).send();
  knex('users').where('username',req.body.username).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.password),user];
  }).spread((result,user) => {
    if (result)
      res.status(200).json({user:{username:user.username,id:user.id}});
    else
      res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.post('/api/users', (req, res) => {
  if (!req.body.password || !req.body.username)
    return res.status(400).send();
  knex('users').where('username',req.body.username).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Username address already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({password: hash, username:req.body.username});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','id');
  }).then(user => {
    res.status(200).json({user:user});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.get('/api/users/:id/favorites', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('favorites','users.id','favorites.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('label','image','url','calories','servings','cps','ingredients','cautions').then(favorites => {
      res.status(200).json({favorites:favorites});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/favorites', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().then(user => {
    return knex('favorites').insert({user_id: id, label:req.body.label, image:req.body.image, url:req.body.url, calories:req.body.calories, servings:req.body.servings, cps:req.body.cps, ingredients:req.body.ingredients, cautions:req.body.cautions, created: new Date()});
  }).then(ids => {
    return knex('favorites').where('id',ids[0]).first();
  }).then(favorites => {
    res.status(200).json({favorites:favorites});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.post('/api/users/:id/items', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().then(user => {
    return knex('items').insert({user_id: id, label:req.body.label, image:req.body.image, url:req.body.url, calories:req.body.calories, servings:req.body.servings, cps:req.body.cps, ingredients:req.body.ingredients, cautions:req.body.cautions});
  }).then(ids => {
    return knex('items').where('id',ids[0]).first();
  }).then(items => {
    res.status(200).json({items:items});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.delete('/api/users/:id/items', (req, res) => {
  let id = parseInt(req.params.id);
  knex('items').where('user_id',id).del();
// .then(favorites => {
//     res.status(200).json();
//     return;
//   }).catch(error => {
//     console.log(error);
//     res.status(500).json({ error });
//   });
});

app.get('/api/users/:id/items', (req, res) => {
  let id = parseInt(req.params.id);
  knex('items').join('items','users.id','items.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('label','image','url','calories','servings','cps','ingredients','cautions').then(items => {
      res.status(200).json({items:items});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.get('/api/users/:id/item', (req, res) => {
  let userId = parseInt(req.params.userId);
  let itemId = parseInt(req.params.itemId);
  knex('items').join('items','users.id','items.user_id')
    .where('users.id',userId)
    .where('items.id',itemId)
    .orderBy('created','desc')
    .select('label','image','url','calories','servings','cps','ingredients','cautions').then(items => {
      res.status(200).json({items:items});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/foodValue', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().then(user => {
  //console.log("postfoodValue: " + req.body.foodValue.diet);
    return knex('foodValue').insert({user_id: id, word:req.body.word, first:req.body.first, last:req.body.last, health:req.body.health, diet:req.body.diet});
    //, count:req.body.count
  }).then(ids => {
    return knex('foodValue').where('id',ids[0]).first();
  }).then(foodValue => {
    res.status(200).json({foodValue:foodValue});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});


app.get('/api/users/:id/foodValue', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('foodValue','users.id','foodValue.user_id')
    .where('users.id',id)
    .select('word', 'first', 'last', 'health', 'diet', 'count').then(foodValue => {
      res.status(200).json({foodValue:foodValue});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.delete('/api/users/:id/foodValue', (req, res) => {
  let id = parseInt(req.params.id);
  knex('foodValue').where('user_id',id).del();
// .then(favorites => {
//     res.status(200).json();
//     return;
//   }).catch(error => {
//     console.log(error);
//     res.status(500).json({ error });
//   });
});

app.get('/api/users/:id/category/:name', (req, res) => {
  let id = parseInt(req.params.id);
  let name = req.params.name.toString();
  console.log("Category: "+ name);
  knex('users').join('pictureposts','users.id','pictureposts.user_id')
    .where({'users.id':id, 'category': name})
    .orderBy('created','desc')
    .select('pictureposts','username','created', 'comment','category').then(pictureposts => {
      res.status(200).json({pictureposts:pictureposts});

    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.get('/api/users/:id/pictureposts', (req, res) => {
  let id = parseInt(req.params.id);
  console.log(id);
  knex('users').join('pictureposts','users.id','pictureposts.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('pictureposts','username','created', 'comment','category').then(pictureposts => {
      res.status(200).json({pictureposts:pictureposts});

    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/pictureposts', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').where('id',id).first().then(user => {
    return knex('pictureposts').insert({user_id: id, pictureposts:req.body.pictureposts, comment:req.body.comment, category: req.body.category, created: new Date()});
  }).then(ids => {
    return knex('pictureposts').where('id',ids[0]).first();
  }).then(pictureposts => {
    res.status(200).json({pictureposts:pictureposts});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});


app.listen(3000, () => console.log('Server listening on port 3000!'));
