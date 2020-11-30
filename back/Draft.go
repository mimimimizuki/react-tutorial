package main

type Draft struct {
	ID       int
	UserId   int
	Title    string
	Overview string
	Link     string
	PostDate string
	Thought  string
}

var Drafts []Draft
