package main

import (
	"database/sql"
	"errors"
	"time"
)
type User struct {
	ID int
	DisplayName string 
	Birthday time.Time 
	Pass string
}
func (u *User) GetUser(db *sql.DB) error {
	return errors.New("Not Implemented")
}
func (u *User) UpdateUser(db *sql.DB) error {
	return errors.New("Not Implemented")
}
func (u *User) CreateUser(db *sql.DB) error {
	return errors.New("Not Implemented")
}
func (u *User) GetUsers(db *sql.DB) error {
	return errors.New("Not Implemented")
}