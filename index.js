const inquirer = require("inquirer")
const axios = require("axios")
const generateHTML = require("./generateHTML")
const fs = require('fs');
const pdf = require('html-pdf');

// ask question username and favorite color (inquiere)
function start() {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "input",
                name: "username",
                message: "What is your github user name?"

            },
            {
                type: "list",
                name: "color",
                message: "What is your favorite color?",
                choices: ["red", "green", "blue", "pink"]
            }
        ])
        .then(answers => {
            // Use user feedback for... whatever!!
            console.log(answers)

            axios.get('https://api.github.com/users/' + answers.username)
                .then(function (response) {
                    // handle success
                    console.log(response.data);

                    //
                    // obj1 {}
                    var color = answers.color
                    var stars = 0
                    var htmlOne = generateHTML({ ...answers, stars, ...response.data })
                    //console.log(htmlOne)
                    //  look for a package to convert html to pdf
                    fs.writeFile("generateHTML.pdf",htmlOne, function (err){
                        if(err){
                            throw err;
                        }
                        console.log('successfully wrote file');
                    })
                    const html = fs.readFileSync('./generateHTML.js', 'utf8');
                    const options = { format: 'Letter' };

                    pdf.create(html, options).toFile('./generateHTML.js', function (err, res) {
                        if (err) return console.log(err);
                        console.log(res);
                    })
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })


        });
}

// go to github API and gather info about the user: axios (query)

// Profile image: response.data.avatar_url
// user name    : response.data.name  
// Links to the following:

// User location via Google Maps: response.data.location
// User GitHub profile: response.data.login
// User blog


// User bio: data.response.bio
// Number of public repositories: data.response.public_repos
// Number of followers: data.response.followers
// Number of GitHub stars // stars are inside of the repos, then you need to do a diferent axios call
// Number of users following


// then when you have the color / user / and the rest of the info:
// you will call generateHTML this function is returning a HTML
// then with the HTML you will use a package(npm) to convert html to pdf (xxxx)
// you will ujser fs.writeFile to wirte the pdf on your computer
start()