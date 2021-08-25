import * as SQLite from "expo-sqlite";

const SqLite = {};

let db = SQLite.openDatabase('db.db');

SqLite.CrearTabla = async () => {
    try {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS puntos (id integer primary key not null, puntos int, dificultad text )'
            );
        });
    } catch (error) {
        console.log("Error al crear tabla", error)
    }
}

SqLite.select = async (setPuntos) => {
    try {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * from puntos order by puntos DESC',
                [],
                (_, { rows: { _array } }) => {
                    setPuntos(_array)

                },
                (tx, error) => {
                    console.log(error);
                }
            );
        });
    } catch (error) {
        console.log("Error select", error)
    }
};

SqLite.insertar = async (puntaje,dificultad) => {
    try {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO puntos(puntos,dificultad) VALUES (?,?)', [puntaje,dificultad]);
        });
    } catch (error) {
        console.log("Error al insertar", error)
    }
};

SqLite.dropTable = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'drop table puntos',
                [],
                (_, result) => { resolve(result) },
                (_, error) => {
                    console.log("error dropping users table"); reject(error)
                }
            )
        })
    })
}

export default SqLite;