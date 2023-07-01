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
    
    res.render('home', {
        items: items
    });
});

app.get('/item/:id', async (req, res) => {
    const item = await prisma.item.findFirst({
        where: {
            id: Number(req.params.id),
        }
    });

    res.render('item', {
        'item': item
    });
});

app.get('/add', isAuth, (req, res) => {
    res.render('add')
})


app.post('/store', isAuth, upload.single('image'), async (req, res) => {
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

app.post('/delete', isAuth, async (req, res) => {
    const { id } = req.body;
    await prisma.item.deleteMany({
        where: {
            id: Number(id)
        }
    });

    res.redirect('/');
})

app.post('/update', isAuth, async (req, res) => {
    const { title, id } = req.body;
    await prisma.item.update({
        where: {
            id: Number(id)
        },
        data: {
            title,
        }
    });

    res.redirect('/');
})

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.get('/add-category', isAuth, (req, res) => {
    res.render('add_cat');
});

app.post('/log-in', async (req, res) => {
    const { name, password } = req.body;
    const item = await prisma.user.findFirst({
        where: {
            name,
            password,
        }
    });
    if (item) {
        req.session.auth = true;
        res.redirect('/');
    } else {
        res.redirect('/');
    };
});

app.post('/sign-up', async (req, res) => {
    const { name, password } = req.body;
    const item = await prisma.user.findFirst({
        where: {
            name,
            password,
        }
    });
    if (item){
        res.redirect('/');
    } else {
        await prisma.user.create({
            data: {
                name,
                password,
            }
        });
        req.session.auth = true;
        res.redirect('/');
    };
});

app.post('/create-cat', isAuth, async (req, res) => {
    const { title, description } = req.body;
    const item = await prisma.category.findFirst({
        where: {
            title,
        }
    });

    if (item) {
        res.redirect('/');
    } else {
        await prisma.category.create({
            data: {
                title,
                description,
            }
        });
        res.redirect('/');
    };
});

app.get('/categories', async (req, res) => {
    const item = await prisma.category.findMany();
    res.render('categories', {
        item,
    });
});

app.post("/del-cat", async (req, res) => {
    await prisma.category.delete({
        where: {
            id: Number(req.body.cat_id),
        }
    });
    res.redirect('/');
});