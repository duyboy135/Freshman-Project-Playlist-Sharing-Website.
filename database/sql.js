var mysql = require('mysql');

/*END OF DEPEDENCY*/
/*This code is written by duyboy135*/


module.exports.con = mysql.createConnection({
  host: 'localhost',
  user: 'duyboy135',
  password: 'duy1234567',
  database: 'ci103'
});
