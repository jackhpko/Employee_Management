var express = require("express");
var path = require("path");
var http = require("http");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var fs = require("fs");
var multipart = require("connect-multiparty");

var app = express();
var multipartMiddleware = multipart();

var conn = mysql.createConnection({
    host: 'dev1.valiantica.com',
    user: 'dev1',
    password: 'valiantica0515',
    database:'test'
});
conn.connect();

app.use(bodyParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('public'));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

//get employee list
app.get('/employee',function(req,res){
	var getQuery = "SELECT e.*, (case when e.managerId is null then '' " +
	" else (select CONCAT(m.fName,' ',m.lName) from test.Jeffrey_Employee m where m.id = e.managerId) end ) as managerName, " +
	"(select count(id) from test.Jeffrey_Employee r where e.id = r.managerId) as report " +
	" FROM test.Jeffrey_Employee e ";
	conn.query(getQuery, function(err, rows) {
		if (err) console.log(err);
		res.send(rows);
	});
});

app.delete('/employee/:id',function(req,res){
	var deleteId = req.params.id;
	var deleteQuery = "DELETE FROM test.Jeffrey_Employee WHERE id =" + deleteId;
	conn.query(deleteQuery, function(err, rows) {
		if (err) console.log(err);
		res.send('id: '+ deleteId + ' deleted successfully!');
	});
});

// get employee by id
app.get('/employee/:id',function(req,res){
	var id = req.params.id;
	var getQuery = "SELECT e.*, (case when e.managerId is null then '' " +
	" else (select CONCAT(m.fName,' ',m.lName) from test.Jeffrey_Employee m where m.id = e.managerId) end ) as managerName, " +
	"(select count(id) from test.Jeffrey_Employee r where e.id = r.managerId) as report " +
	" FROM test.Jeffrey_Employee e WHERE e.id = " + id;
	conn.query(getQuery, function(err, rows) {
		if (err) console.log(err);
		res.send(rows);
	});
});

// get report to
app.get('/getReport/:id',function(req,res){
	var id = req.params.id;
	var getQuery = "SELECT e.*, (case when e.managerId is null then '' " +
	" else (select CONCAT(m.fName,' ',m.lName) from test.Jeffrey_Employee m where m.id = e.managerId) end ) as managerName, " +
	"(select count(id) from test.Jeffrey_Employee r where e.id = r.managerId) as report " +
	" FROM test.Jeffrey_Employee e WHERE e.managerId = " + id;
	conn.query(getQuery, function(err, rows) {
		if (err) console.log(err);
		res.send(rows);
	});
});

// create new employee
app.post('/employee', function(req,res){
	console.log(req.body);
	var imgPath = 'images/id'+req.body.id+'.jpg';
	var insertQuery = " INSERT INTO test.Jeffrey_Employee (id,fName,lName,title,age,sex,phone,email,managerId,imgPath) " +
						"VALUES ('"+req.body.id+"', '"+req.body.fName+"', '"+req.body.lName+"', '"+req.body.title+"', '"+req.body.age+"', '"+req.body.sex+"', '"+req.body.phone+"', '"+req.body.email+
						"', '"+req.body.managerId+"', '"+imgPath+"') ";
	conn.query(insertQuery, function(err, rows) {
		if (err) console.log(err);
		res.send('New user created successfully!');
	});
});

//edit employee
app.put('/employee/:id', function(req, res){
	var id = req.params.id;
	var updateQuery = " UPDATE test.Jeffrey_Employee SET fName = '"+req.body.fName+"', lName = '"+req.body.lName+"', title = '"+req.body.title+"', age = '"+req.body.age+"', sex = '"+req.body.sex+"', phone = '"+req.body.phone+ 
						"', email = '"+req.body.email+"', managerId = '"+req.body.managerId+"' WHERE id =" + id;
	conn.query(updateQuery, function(err, rows) {
		if (err) console.log(err);
		res.send('User updated successfully!');
	});
});

//upload image
app.post('/upload/:id',multipartMiddleware, function(req, res) {
	var id = req.params.id;
	var image =  req.files.img;
    var newImageLocation = path.join(__dirname, 'public/images', 'id'+id+'.jpg');
    console.log(newImageLocation);
    fs.readFile(image.path, function(err, data) {
        fs.writeFile(newImageLocation, data, function(err) {
            res.json(200, {
                src: 'images/' + image.name,
                size: image.size
            });
        });
    });
});

//get manager dropdown list
app.get('/manager/:id',function(req,res){
	var id = req.params.id;
	var getQuery = "SELECT e.*, (case when e.managerId is null then '' " +
	" else (select CONCAT(m.fName,' ',m.lName) from test.Jeffrey_Employee m where m.id = e.managerId) end ) as managerName, " +
	"(select count(id) from test.Jeffrey_Employee r where e.id = r.managerId) as report " +
	" FROM test.Jeffrey_Employee e WHERE (e.managerId != "+id+" and e.id != "+id+" ) or e.managerId is null";
	conn.query(getQuery, function(err, rows) {
		if (err) console.log(err);
		res.send(rows);
	});
});


app.listen(3000, function(){
	console.log('Express server started');
});