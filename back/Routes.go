package main

import (
	"net/http"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
	Route{
		"GetPosts", "GET", "/posts", GetPosts,
	},
	Route{
		"GetPost", "GET", "/posts/{id}", GetPost,
	},
	Route{
		"AddPost", "POST", "/posts", AddPost,
	},
	Route{
		"UpdatePost", "PUT", "/posts", UpdatePost,
	},
	Route{
		"RemovePost", "DELETE", "/posts/{id}", RemovePost,
	},
	Route{
		"AddUser", "POST", "/users/", AddUser,
	},
	Route{
		"GetUsers", "GET", "/users/", GetUsers,
	},
	Route{
		"GetUser", "GET", "/users/{id}", GetUser,
	},
	Route{
		"UpdateUser", "PUT", "/users/{id}", UpdateUser,
	},
	Route{
		"RemoveUser", "DELETE", "/users/{id}", RemoveUser,
	},
}
