const express = require('express')
const cookieParser = require('cookie-parser')
const mssql = require('mssql')

/**
 * KONFIGURACJA
 */
const HTTP_PORT = 4000
const DB_LOGIN = 'appUser';             // nazwa użytkownika bazy danych
const DB_PASSWORD = 'tajneHaslo123';    // hasło użytkownika bazy danych
const DB_SERVER = 'localhost'           // adres serwera bazy danych
const DB_NAME = 'TestApp';              // nazwa bazy danych
const DB_URI = `mssql://${DB_LOGIN}:${DB_PASSWORD}@${DB_SERVER}/${DB_NAME}`
/*****************/

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

app.post('/api/login', (request, response) => {
  new mssql.Request()
    .input('login', mssql.VarChar(10), request.body.login)
    .input('haslo', mssql.VarChar(10), request.body.haslo)
    .query('SELECT * FROM Uzytkownicy WHERE Login = @login AND Haslo = @haslo')
    .then(result => {
      if (result.recordset.length === 1) {
        response.cookie('user', result.recordset[0].Id)

        response.json({
          result: 'OK'
        })
      } else {
        response.status(401).json({
          result: 'ERROR'
        })
      }
    })

});

app.post('/api/logout', (request, response) => {
  response.clearCookie('user');

  response.json({
    result: 'OK'
  });
});

app.get('/api/user', (request, response) => {
  new mssql.Request()
    .input('id', mssql.VarChar(10), request.cookies.user)
    .query('SELECT Imie, Nazwisko, Login FROM Uzytkownicy WHERE Id = @id')
    .then(result => {
      if (result.recordset.length === 1) {
        response.json(result.recordset[0])
      } else {
        response.json({})
      }
    })
    .catch(err => {
      console.log('Nie udało się pobrać użytkownia -> ', err)
    })
});

mssql.connect(DB_URI)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Aplikacja działa pod adresem http://localhost:${HTTP_PORT}`)
    })
  })
  .catch(err => {
    console.error("Błąd połączenia z bazą danych -> ", err)
  })

