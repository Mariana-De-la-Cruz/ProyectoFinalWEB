const express = require("express");
const morgan = require("morgan"); 
const cors = require('cors'); 
require('dotenv').config();
const app=express();

app.use(express.json());
app.use(morgan('combined'))
app.use(cors())
app.use(express.urlencoded({extended: true}));

//CONEXIÓN A LA BASE DE DATOS
const mysql = require('mysql2');
    const connection = mysql.createConnection({
        host: process.env.HOST || "localhost",
        port: process.env.dbPORT || 3000,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    });

app.get('/tenistas', (req, res) =>{
    connection.query(
      'SELECT * FROM tenistas',
      function (err, results, fields) {
      console.log(results); 
      res.json(results); 
    });
});

app.post('/tenistas', (req, res) => {
    const {nombre, apellido, genero, edad, pais, estatura, ranking} = req.body;

    const query = 'INSERT INTO tenistas (nombre, apellido, genero, edad, pais, estatura, ranking) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [nombre, apellido, genero, edad, pais, estatura, ranking], (err, result) => {
        if (err) {
            console.error('Error al insertar:', err);
            return res.status(500).json({ error: 'Error al insertar tenista' });
        }
        res.json({ message: 'Tenista agregado exitosamente', insertId: result.insertId });
    });
});

app.delete('/tenistas', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el parámetro id' });
    }

    const query = 'DELETE FROM tenistas WHERE ID = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar:', err);
            return res.status(500).json({ error: 'Error al eliminar tenista' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró ningún tenista con ese id' });
        }

        res.json({ message: 'Tenista eliminado exitosamente', affectedRows: result.affectedRows });
    });
});

app.patch('/tenistas', (req, res) => {
    const { id } = req.query;
    const { nombre, apellido, genero, edad, pais, estatura, ranking } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el parámetro id' });
    }

    //CONSTRUYE LOS CAMPOS DINÁMICAMENTE 
    const campos = [];
    const valores = [];

    if (nombre !== undefined) { campos.push('nombre = ?'); valores.push(nombre); }
    if (apellido !== undefined) { campos.push('apellido = ?'); valores.push(apellido); }
    if (genero !== undefined) { campos.push('genero = ?'); valores.push(genero); }
    if (edad !== undefined) { campos.push('edad = ?'); valores.push(edad); }
    if (pais !== undefined) { campos.push('pais = ?'); valores.push(pais); }
    if (estatura !== undefined) { campos.push('estatura = ?'); valores.push(estatura); }
    if (ranking !== undefined) { campos.push('ranking = ?'); valores.push(ranking); }

    if (campos.length === 0) {
        return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    const query = `UPDATE tenistas SET ${campos.join(', ')} WHERE ID = ?`;
    valores.push(id);

    connection.query(query, valores, (err, result) => {
        if (err) {
            console.error('Error al actualizar:', err);
            return res.status(500).json({ error: 'Error al actualizar tenista' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró ningún tenista con ese id' });
        }

        res.json({ message: 'Tenista actualizado exitosamente' });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server express corriendo en el puerto ${PORT}`);
});
