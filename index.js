const fs = require('fs');

const http = require('http');

const url = require('url');



const replaceTemplate = require('./1-node-farm/starter/modules/replaceTemplate');

// console.log(__dirname);

// console.log(typeof fs);


//Non blocking, Asynchronous way

// fs.readFile('./1-node-farm/starter/txt/start.txt','utf-8',(err,data1) => {
//     if(err) return console.log('ERROR!');
//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`,'utf-8',(err,data2) => {
//         console.log(data2);
//         fs.readFile(`./1-node-farm/starter/txt/append.txt`,'utf-8',(err,data3) => {
//             console.log(data3);

//             fs.writeFile('./1-node-farm/starter/txt/final.txt',`${data2}\n${data3}`,'utf-8',err => {
//                 console.log("node is smart and your file has been written");
//             });
//         });
//     });
// });

// console.log('call back is called once reading the file is over');

/*-------------------Server-----------------------*/



const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-card.html`,'utf-8');


const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req,res) => {
    
    const {query, pathname} = url.parse(req.url,true);

    //overview page
    if(pathname === '/' || pathname === '/overview'){

        res.writeHead(200,{
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);

    //product page
    }else if(pathname === '/product') {
        res.writeHead(200,{
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //api
    }else if(pathname === '/api'){
        res.writeHead(200,{
            'Content-type': 'application/json'
        });
        res.end(data);
        
    //not found   
    }else {
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'flip-world'
        });
        res.end("<h1>Oops! We can't find the page you requested.</h1>")
    }
    //res.end('Hello from the server');
});

server.listen(8000, '127.0.0.1',() => {
    console.log("Listening to requests on port 8000");
});



/*--------------------End of server----------------*/