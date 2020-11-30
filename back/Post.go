package main

type Post struct {
	ID       int
	UserId   int
	PostDate string
	Title    string
	Overview string
	Link     string
	Thought  string
}

var Posts []Post
