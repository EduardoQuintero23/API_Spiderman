import express from 'express'
import { Peliculas, db } from './db.js'
import jwt from 'jsonwebtoken'
import { Sequelize } from 'sequelize'

const app = express()
const PORT = 3000

const validacionDatos = (req, res, next) => {
    const {Titulo, ActorPrincipal, Año} = req.body;

    if (!Titulo) {
        return res.status(400).json({Error: 'El titulo es obligatorio'})
    }
    if (!ActorPrincipal) {
        return res.status(400).json({Error: 'El actor principal es obligatorio'})
    }
    if (!Año) {
        return res.status(400).json({Error: 'El año es obligatorio'})
    }

    next();
}

const verificarToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Token requerido' });

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
            
        req.user = decoded;
        next();
});
};

app.use(express.json())

try {
    await db.authenticate();
    console.log('Conexión con PostgreSQL establecida');
    await db.sync();
    } catch (error) {
        console.error('Error al inicializar la base de datos', error);
    }

app.listen(process.env.PORT, () => {
    console.log('Servidor iniciado en el puerto ', PORT)
})

app.get('/spiderman', verificarToken, async (req, res) => {
        const peliculasSpiderman = await Peliculas.findAll()
    res.status(200).json({peliculasSpiderman});
});

app.post('/spiderman', validacionDatos, async (req , res) => {
    try{
        const peliculaNueva = await Peliculas.create(req.body);
         res.status(201).json(peliculaNueva);
    } catch (error)  {
        res.status(400).json({ error: 'No se pudo insertar' });
    }

});

app.put('/spiderman/:id', async (req, res) => {
    const peli = await Peliculas.findByPk(req.params.id);
    if (peli) {
        await peli.update(req.body);
        res.json(peli);
    } else {
        res.status(404).json({ error: 'Película no encontrada'});
    }
});

app.delete('/spiderman/:id', async (req, res) => {
    const borrar = await Peliculas.destroy({where: {id: req.params.id}});
    res.json({ eliminado: 'Registro eliminado'});
});

const SECRET_KEY = 'clave_secreta'

app.post('/login', (req, res) => {
    const {usuario, contraseña} = req.body;

    if (usuario === 'Stan_Lee' && contraseña === "Marvel") {
        const user = {id: 1, nombre: 'Stan Lee'};

        const token = jwt.sign(user, SECRET_KEY, {expiresIn: '1h'});

        res.json({Mensaje: 'Login exitoso', token});
    } else {
        res.status(401).json({Mensaje: 'Login incorrecto'});
    }
});