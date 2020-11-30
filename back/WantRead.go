package main

type WantRead struct {
	ID     int
	UserId int
	Title  string
	Link   string
}

var WantReads []WantRead
