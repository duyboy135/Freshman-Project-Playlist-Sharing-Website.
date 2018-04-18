var level = require('level')
 
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = level('./mydb')
 
// 2) Put a key & value
db.put('name', '10', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error
 
  // 3) Fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found
 
    // Ta da!
  //  console.log('name=' + value)
  })
})

db.put('duy', '50', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error
 
  // 3) Fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found
 
    // Ta da!
  //  console.log('duy=' + value)
  })
})
db.createReadStream({ keys: true, values: false })
  .on('data', function (data) {
    console.log('key=', data)
  })