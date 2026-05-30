import { Sequelize, DataTypes } from 'sequelize'

const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    storage: 'database.postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

const Peliculas = db.define('Peliculas', {
    id:{
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    Titulo: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    ActorPrincipal: {
            type: DataTypes.STRING,
            allowNull: false
    },
    Año: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});


async function startDB() {
    await db.sync({force: true})

    await Peliculas.bulkCreate([
        {id: 1, Titulo: 'Spiderman', ActorPrincipal: 'Tobey_Maguire', Año: 2002},
        {id: 2, Titulo: 'Spiderman_2', ActorPrincipal: 'Tobey_Maguire', Año: 2004},
        {id: 3, Titulo: 'Spiderman_3', ActorPrincipal: 'Tobey_Maguire', Año: 2007},
        {id: 4, Titulo: 'The_Amazing_Spiderman', ActorPrincipal: 'Andrew_Garfield', Año: 2012},
        {id: 5, Titulo: 'The_Amazing_Spiderman_2', ActorPrincipal: 'Andrew_Garfield', Año: 2014},
        {id: 6, Titulo: 'Spiderman_Homecoming', ActorPrincipal: 'Tom_Holland', Año: 2017},
        {id: 7, Titulo: 'Spiderman_Far_From_Home', ActorPrincipal: 'Tom_Holland', Año: 2019},
        {id: 8, Titulo: 'Spiderman_No_Way_Home', ActorPrincipal: 'Tom_Holland', Año: 2021},
        {id: 9, Titulo: 'Spiderman_Brand_New_Day', ActorPrincipal: 'Tom_Holland', Año: 2026}
    ])

    const peliculasSpiderman = await Peliculas.findAll();
    console.log('Todas las películas de Spiderman son: ', peliculasSpiderman)
};

startDB();

export { Peliculas }