package main

type Draft struct {
	ID       int
	UserId   int
	Title    string
	Overview string
	Link     string
	Thought  string
	Tags     []string
}

var Drafts []Draft
