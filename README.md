# Введение в системы управления базами данных 

СУБД — комплекс программ, позволяющих создать базу данных (БД) и манипулировать данными (вставлять, обновлять, удалять и выбирать). Система обеспечивает безопасность, надёжность хранения и целостность данных, а также предоставляет средства для администрирования БД.

## СУБД MySQL

    https://www.mysql.com/

## SQL

SQL (аббр. от англ. Structured Query Language — «язык структурированных запросов») — декларативный язык программирования, применяемый для создания, модификации и управления данными в реляционной базе данных, управляемой соответствующей системой управления базами данных.

Просмотр листинга баз данных

    SHOW DATABASES;

Пример создания базы данных

    CREATE DATABASE nature;

Подключить базу данных

    USE nature;

Просмотр листинга таблиц БД

    SHOW TABLES;

Пример создания таблицы в БД

    CREATE TABLE items (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255), image VARCHAR(255));

Пример изменения типа столбца в БД

    ALTER TABLE items MODIFY COLUMN description VARCHAR(3200);

Пример добавления столбца в БД

    ALTER TABLE items ADD description VARCHAR(255) AFTER image;

Просмотр структуры таблицы БД

    DESCRIBE items;

Выборка данных

    SELECT * FROM nature;

Пример выборки данных с условием

    SELECT * FROM nature WHERE id=2;

Пример записи данных в БД

    INSERT INTO nature (title, image) VALUES ('Природа', 'nature.jpeg');

Пример обновления записи в БД

    UPDATE nature SET title='Природа 2' WHERE id=2;

Пример удаления записи из БД

    DELETE FROM nature WHERE id=2;

Удаление БД

    DROP DATABASE nature;

Удаление таблицы в БД

    DROP TABLE items;
