package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func (a *App) Initialize(user, password, dname string) {
	connectionString := fmt.Sprintf("sslmode=disable user=%s dbname=%s", user, dname)
	var err error
	a.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(connectionString)
	a.Router = mux.NewRouter()
}
func (a *App) Run(addr string) {

}
