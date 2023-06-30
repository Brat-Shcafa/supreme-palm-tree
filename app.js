const express = require('express')
const path = require('path');
const fs = require("fs");
const session = require('express-session');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require("multer");
const { log } = require('console');

// Путь к директории для загрузок
const upload = multer({ dest: "public/img" });


app.use(express.json());

// Путь к директории файлов ресурсов (css, js, images)
app.use(express.static('public'));

// Настройка шаблонизатора
app.set('view engine', 'ejs');

// Путь к директории файлов отображения контента
app.set('views', path.join(__dirname, 'views'));

// Обработка POST-запросов из форм
app.use(express.urlencoded({ extended: true }));

// Инициализация сессии
app.use(session({ secret: "Secret", resave: false, saveUninitialized: true }));

// Запуск веб-сервера по адресу http://localhost:10007
app.listen(10007);

// Middleware
function isAuth(req, res, next) {
    if (req.session.auth) {
        next();
    } else {
        res.redirect('/');
    }
};


/**
 * Маршруты
 */
app.get('/', async (req, res) => {
    const items = await prisma.item.findMany();
    console.log(items);
    res.render('home', {
        items: items
    });
});

app.get('/item/:id', (req, res) => {
    
});

app.get('/add', (req, res) => {
    res.render('add')
})


app.post('/store', upload.single('image'), async (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(
        "./public/img/" + req.file.originalname
    );    
    fs.rename(tempPath, targetPath, (err) => {
        if (err) console.log(err);
    });;

    const { title, image } = req.body;
    await prisma.item.create({
        data: {
            title,
            image: req.file.originalname,
        }
    });

    res.redirect('/');
})

app.post('/delete', (req, res) => {
    
})

app.post('/update', (req, res) => {
    
})

app.get('/auth', (req, res) => {
    res.render('auth');

});

app.post('/log-in', (req, res) => {
    
});