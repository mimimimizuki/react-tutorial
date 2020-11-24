package main_test

import (
	"os"
	"testing"
	"."
	"log"
	"net/http"
	"net/http/httptest"
	"encoding/json"
)
var a main.App
func TestMain(m *testing.M) {
	os.Setenv("APP_DB_USERNAME", "postgres")
	os.Setenv("APP_DB_PASSWORD", "")
	os.Setenv("APP_DB_NAME", "papers")
	a.Initialize(os.Getenv("APP_DB_USERNAME"),
	os.Getenv("APP_DB_PASSWORD"),
	os.Getenv("APP_DB_NAME"))
	log.Println(a)
	ensureTableExists()
	code := m.Run()
	clearTable()
	os.Exit(code)
}
func ensureTableExists() {
	_ , err := a.DB.Exec(tableCreationQuery)
	if  err != nil {
		log.Fatal(err)
	}
}
func clearTable() {
	a.DB.Exec("DELETE FROM users")
	a.DB.Exec("ALTER SEQUENCE user_id_seq RESTART WITH 1")
}
const tableCreationQuery = `CREATE TABLE users
(
	user_id SERIAL, 
	display_name TEXT NOT NULL,
	birthday DATE NOT NULL,
	pass TEXT NOT NULL
)`

func executeRequest(req *http.Request) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	a.Router.ServeHTTP(rr, req)

	return rr
}

func checkResponseCode(t *testing.T, expected, actual int){
	if expected != actual {
		t.Errorf("Expected response code %d, Got %d\n", expected, actual)
	}
}

func TestEmptyTable(t *testing.T) {
	clearTable()
	req, _ := http.NewRequest("GET", "/users", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)
	if body := response.Body.String(); body != "[]" {
		t.Errorf("expected an empty array, got %s", body)
	}
}
func TestGetNonExistentProduct(t *testing.T) {
	clearTable()

	req, _ := http.NewRequest("GET", "/users/1", nil)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusNotFound, response.Code)

	var m map[string]string
	json.Unmarshal(response.Vody.Bytes(), &m)
	if m["error"] != "Product not found" {
		t.Errorf("Expected the 'error' key of the response to be set to 'Product not found'. Got '%s'", m["error"])
	}
}