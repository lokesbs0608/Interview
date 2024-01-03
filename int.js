// const express = require('express');
// const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// require('dotenv').config();
// const csv = require('csv-parser');
// const fs = require('fs');


// // DB
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database!');
//     uploadDataFromCSV(csvFilePath,targetTableName);
// });



// // Function to upload data from CSV to MySQL
// let i = 0;
// function uploadDataFromCSV(filePath, tableName) {
//     fs.createReadStream(filePath)
//         .pipe(csv())
//         .on('data', (row) => {
//             // Process each row and insert into the MySQL table
//             connection.query(`INSERT INTO ${tableName} SET ?`, row, (error, results, fields) => {
//                 if (error) throw error;
//                 console.log( i++,'added');
//             });
//         })
//         .on('end', () => {
//             console.log('CSV file successfully processed.');
//             // Close the MySQL connection after processing the CSV
//             connection.end();
//         });
// }

// // Example usage
// const csvFilePath = '/Users/lokesh/Desktop/Interview/newmacthdeatils - matches_updated_mens_ipl.csv.csv';
// const targetTableName = 'matches_updated_mens_ipl';




// // // App run

// app.listen(process.env.PORT, () => {
//     console.log(`server running on port ${process.env.PORT}`)
// })

// // // Routes

// // // app.post('/num', (req, res) => {
// // //     if (req.body) {
// // //         res.send(genrateSequence(req.body.num))
// // //     }
// // //     else {
// // //         req.send('Invalid Number')
// // //     }
// // // })
// // app.get('/', (req, res) => {
// //     res.send('get')
// // })

// // // // function
// // // const genrateSequence = (num) => {
// // //     let prevNum = 0;
// // //     let nextNum = 1;
// // //     let arr = [];
// // //     let finalStr = '';
// // //     arr.push(prevNum, nextNum);
// // //     for (let i = 0; arr.length < num; i++) {
// // //         let res = prevNum + nextNum;
// // //         prevNum = nextNum;
// // //         nextNum = res;
// // //         arr.push(res)
// // //     }
// // //     arr.forEach((a) => {
// // //         finalStr = finalStr + a.toString();
// // //     })

// // //     return finalStr
// // // }
