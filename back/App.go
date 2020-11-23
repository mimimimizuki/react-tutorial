package main

import (
	"database/sql"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"fmt"
	"log"
)

type App struct {
	Router *mux.Router
	DB *sql.DB
}

func (a *App) Initialize(user, password, dname string) {
    connectionString :=
        fmt.Sprintf("sslmode=disable user=%s password=%s dbname=%s", user, password, dname)
    var err error
    a.DB, err = sql.Open("postgres", connectionString)
    if err != nil {
        log.Fatal(err)
    }
	a.Router = mux.NewRouter()
}
func (a *App) Run(addr string) {

}