package main

type User struct {
	ID           int
	DisplayName  string
	AuthID       string
	BIO          string
	FollowerNum  int
	FollowingNum int
}

var Users []User
