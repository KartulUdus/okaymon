var express   = require('express'),
    Pokemon   = require('../models/pokemon.js'),
    apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
  // console.log('Somebody just came to our app!');
  // console.log('This is where we will authenticate users -- but later!');
  next();
});

apiRouter.get('/', function(req, res) {
  res.redirect('/api/pokemon');
});

apiRouter.route('/pokemon')
  // .post(function(req, res) {

  //   var pokemon = new Pokemon();

  //   pokemon.name = req.body.name.toLowerCase().capitalize();
  //   pokemon.evolutions = req.body.evolutions; 
  //   pokemon.types = req.body.types;
  //   pokemon.national_id = req.body.national_id;
  //   pokemon.pkdx_id = req.body.pkdx_id;
  //   pokemon.sprites = req.body.sprites;
  //   pokemon.resource_uri = req.body.resource_uri;


  //   pokemon.save(function(err) {
  //     if (err && (11000 === err.code || 11001 === err.code)) {
  //       // duplicate entry
  //       return res.json({ 
  //         success: false, 
  //         message: 'A pokemon with that name already exists.'
  //       });
  //     } else {
  //       return res.send(err);
  //     }
  //     res.json({ message: 'Pokemon created!' });
  //   });
  // })
  .get(function(req, res) {
    // Limit number of pokemon in response.
    if (req.query.limit >= 0) {
      Pokemon.find(function(err, pokemon) {
        res.json(pokemon.slice(0, req.query.limit));
      });
    } 
    // Find a pokemon by national_id. 
    else if (req.query.id >= 0) {
      Pokemon.find({"national_id": req.query.id}, function(err, pokemon) {
        res.json(pokemon);
      });
    } 
    // Find a pokemon by type
    else if (req.query.type) {
      Pokemon.find({ 
        "types": {
          "$elemMatch": {
            "name": req.query.type
          }
        }
      }, function(err, pokemon) {
        res.json(pokemon);
      })
    } 
    // Return all pokemon.
    else {
      Pokemon.find(function(err, pokemon) {
        res.json(pokemon);
      });
    }
  });

apiRouter.route('/pokemon/:pokemon_name')
  .get(function(req, res) {
    var pokemonName = req.params.pokemon_name;
    Pokemon.find({"name": pokemonName.toLowerCase().capitalize()}, function(err, pokemon) {
      if (err) res.send(err);
      res.json(pokemon);
    })
  })
  // .put(function(req, res) {
  //   var pokemonName = req.params.pokemon_name;
  //   Pokemon.find({"name": pokemonName.capitalize()}, function(err, pokemon) {
  //     if (err) res.send(err);

  //     if (req.body.name) pokemon.name = req.body.name;
  //     if (req.body.evolutions) pokemon.evolutions = req.body.evolutions; 
  //     if (req.body.types) pokemon.types = req.body.types;
  //     if (req.body.national_id) pokemon.national_id = req.body.national_id;
  //     if (req.body.pkdx_id) pokemon.pkdx_id = req.body.pkdx_id;
  //     if (req.body.sprites) pokemon.sprites = req.body.sprites;
  //     if (req.body.resource_uri) pokemon.resource_uri = req.body.resource_uri;
  //   })
  // });

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = apiRouter;