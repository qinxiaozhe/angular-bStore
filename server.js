var express=require('express');
var fs=require('fs');
var path=require('path');
var bodyParser=require('body-parser');
var app=express();
function read(callback){
    fs.readFile('./book.json','utf8',function(err,data){
        if(err && data.length==0){
            callback([]);
        }else{
            callback(JSON.parse(data));
        }
    })
}
function write(data,callback){
    fs.writeFile('./book.json',JSON.stringify(data),callback)
}
app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.join(__dirname,'teml')));
app.use(express.static(path.join(__dirname,'node_modules')));
app.use(bodyParser.json());
app.get('/',function(req,res){
    res.send('./index.html')
});
app.get('/books',function(req,res){
    read(function(data){
        res.send(data);
    })
});
app.get('/books/:id',function(req,res){
    var id=req.params.id;
    read(function(data){
        var book=data.find(function(item){
            return item.id==id;
        });
        res.send(book);
    })
});
app.post('/books',function(req,res){
    var book=req.body;
    read(function(data){
        book.id=data.length==0?1:data[data.length-1].id+1;
        data.push(book);
        write(data,function(){
            res.send(book);
        })

    })
});
app.put('/books/:id',function(req,res){
    var id=req.params.id;
    var book=req.body;
    read(function(data){
        data=data.map(function(item){
            if(item.id==id){
                return book;
            }
            return item;
        });
        write(data,function(){
            res.send(book);
        })
    })
});
app.delete('/books/:id',function(req,res){
    var id=req.params.id;
    read(function(data){
        data=data.filter(function(item){
            return item.id!=id;
        });
        write(data,function(){
            res.send({});
        })
    })
});
app.listen(8080);