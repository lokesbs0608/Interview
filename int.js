// Take a user input say, an input is given as 13. Generate a string, starting with O on LHS, and print it on the console.
// 01123581321345589144

// 01123581321345589144
// 01123581321345589144

const express = require('express');
const app = express();
const bodyParser = require("body-parser");


app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("server running on port 3000")
})

app.post('/num', (req, res) => {
    if (req.body) {
        res.send(genrateSequence(req.body.num))
    }
    else {
        req.send('Invalid Number')
    }
})
app.get('/', (req, res) => {
    res.send('get')
})



const genrateSequence = (num) => {
    let prevNum = 0;
    let nextNum = 1;
    let arr = [];
    let finalStr = '';
    arr.push(prevNum, nextNum);
    for (let i = 0; i <= num; i++) {
        let res = prevNum + nextNum;
        prevNum = nextNum;
        nextNum = res;
        if (arr.length < num) {
            arr.push(res)
        }
    }
    arr.forEach((a) => {
        finalStr = finalStr + a.toString();
    })
    return finalStr;
}
