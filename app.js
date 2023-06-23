require('dotenv').config()
const express = require('express')
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const e = require('express');
const app = express();

// Соединение с базой данных
const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.PASSWORD
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    }
});

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
app.get('/', (req, res) => {
    const itemsPerPage = 5;
    let page = parseInt(req.query.page); // localhost?page=4
    if (!page) page = 1;
    connection.query("select count(id) as count from items", (err, data, fields) => {
        const count = data[0].count;
        const pages = Math.ceil(count / itemsPerPage)

        if (page > pages) {
            page = pages;
        };

        connection.query("SELECT * FROM items LIMIT ? OFFSET ?",
            [itemsPerPage, itemsPerPage * (page - 1)],
            (err, data, fields) => {
                if (err) {
                    console.log(err);
                }

                res.render('home', {
                    'items': data,
                    "curPage": page,
                    "totPage": pages,
                });
            }
        );
    });
})

app.get('/categories', (req, res) => {
    connection.query('select * from categories;', (err, data, fields) => {
        if (err) console.log(err);
        res.render('categories', {
            'cats': data
        });
    });
});

app.get('/category/:id', (req, res) => {
    connection.query('select * from items where cat_id=?', [[req.params.id]], (err, data, fields) => {
        if (err) console.log(err);
        res.render('items_with_cat', {
            'items': data
        });
    });
});

app.post('/items', (req, res) => {
    let offset = req.body.offset;
    connection.query('select * from items limit 5 offset ?', [[offset]], (err, data, fields) => {
        if (err) {
            console.log(err);
        };
        res.status(200).send(data);

    });
});

app.get('/item/:id', (req, res) => {
    connection.query("SELECT * FROM items WHERE id=?", [req.params.id],
        (err, data, fields) => {
            if (err) console.log(err);
            connection.query('select * from categories', (err, cats, fields) => {
                connection.query('select * from categories where id IN (select cat_id from item_category where item_id = ?);',
                    [[data[0].id]],
                    (err, cats_for, fields) => {
                        if (err) console.log(err);
                        res.render('item', {
                            'item': data[0],
                            'cats_for_item': cats_for,
                            'cats': cats
                        });
                    });
            });
        });
});

app.get('/add', isAuth, (req, res) => {
    res.render('add')
})

app.get('/add_cat', isAuth, (req, res) => {
    res.render('add_cat');
});

app.post('/store', isAuth, (req, res) => {
    connection.query(
        "INSERT INTO items (title, image, cat_id) VALUES (?, ?)",
        [[req.body.title], [req.body.image]],
        (err, data, fields) => {
            if (err) {
                console.log(err);
            }

            res.redirect('/');
        }
    );
})

app.post('/delete', (req, res) => {
    connection.query(
        "DELETE FROM items WHERE id=?", [[req.body.id]], (err, data, fields) => {
            if (err) {
                console.log(err);
            }
            connection.query('delete from item_category where item_id = ?', 
                             [[req.body.id]], (err, data1, fields) => {
                                 if (err) console.log(err);
                                res.redirect('/');
                             }
        }
    );
})

app.post('/update', (req, res) => {
    connection.query(
        "UPDATE items SET title=?, image=? WHERE id=?", [[req.body.title], [req.body.image], [req.body.id]], (err, data, fields) => {
            if (err) {
                console.log(err);
            }
            if (err) console.log(err);
            res.redirect('/');
        }
    );
})

app.get('/auth', (req, res) => {
    res.render('auth');

});

app.post('/authh', (req, res) => {
    connection.query(
        "SELECT * FROM users WHERE name=? and password=?",
        [[req.body.name], [req.body.password]],
        (err, data, fields) => {
            if (err) {
                console.log(err);
            }
            if (data.length > 0) {
                req.session.auth = true;
            };
            res.redirect('/');
        }
    );
});

app.post('/cat_add', isAuth, (req, res) => {
    connection.query('insert into categories (title, description) values (?, ?)', [[req.body.cat_title], [req.body.cat_desc]], (err, data, fields) => {
        if (err) console.log(err);
        res.redirect('/')
    });
});

app.post('/add_to_cat', isAuth, (req, res) => {
    connection.query('select * from categories where title = ?', [[req.body.cats]], (err, cat_id, fields) => {
        if (err) console.log(err);
        connection.query('select * from item_category where item_id = ? and cat_id = ?', [[Number(req.body.id)], [cat_id[0].id]], (err, data, fields) => {
            if (err) console.log(err);
            if (data.length <= 0) {
                connection.query('insert into item_category (item_id, cat_id) values (?, ?)', [[req.body.id], [cat_id[0].id]], (err, data, fields) => {
                    if (err) console.log(err);
                    res.redirect('/');
                });
            } else {
                res.redirect('/');
            };
        });
    });
});
