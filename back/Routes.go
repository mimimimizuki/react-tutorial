package main

import (
	"net/http"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
	Isprivate   bool
}

type Routes []Route

var routes = Routes{
	Route{
		"GetPosts", "GET", "/posts", GetPosts, false,
	},
	Route{
		"GetPost", "GET", "/posts/{id}", GetPost, true,
	},
	Route{
		"GetPostDetail", "GET", "/posts/{post_id}/detail", GetPostDetail, false,
	},
	Route{
		"AddPost", "POST", "/posts", AddPost, true,
	},
	Route{
		"UpdatePost", "PUT", "/posts", UpdatePost, true,
	},
	Route{
		"RemovePost", "DELETE", "/posts/{id}/remove", RemovePost, true,
	},
	Route{
		"AddUser", "POST", "/users", AddUser, false,
	},
	Route{
		"GetUsers", "GET", "/users", GetUsers, false,
	},
	Route{
		"GetUser", "GET", "/users/{id}/auth", GetUser, true,
	},
	Route{
		"GetOtherUser", "GET", "/users/{id}", GetOtherUser, false,
	},
	Route{
		"UpdateUser", "PUT", "/users/{id}/update", UpdateUser, true,
	},
	Route{
		"RemoveUser", "DELETE", "/users/{id}", RemoveUser, true,
	},
	Route{
		"GetWantReads", "GET", "/wantReads", GetWantReads, true,
	},
	Route{
		"GetWantRead", "GET", "/wantReads/{id}", GetWantRead, true,
	},
	Route{
		"AddWantRead", "POST", "/wantReads", AddWantRead, true,
	},
	Route{
		"UpdateWantRead", "PUT", "/wantReads", UpdateWantRead, true,
	},
	Route{
		"RemoveWantRead", "DELETE", "/wantReads/{id}/remove", RemoveWantRead, true,
	},
	Route{
		"AddFavorite", "POST", "/favorites", AddFavorite, true,
	},
	Route{
		"GetFavorite", "GET", "/favorites/{id}", GetFavorite, true,
	},
	Route{
		"RemoveFavorite", "DELETE", "/favorites/{id}", RemoveFavorite, true,
	},
	Route{
		"GetSearchPost", "GET", "/search", GetSearchPost, false,
	},
	Route{
		"AddDraft", "POST", "/drafts", AddDraft, true,
	},
	Route{
		"GetDraft", "GET", "/drafts/{id}", GetDraft, true,
	},
	Route{
		"UpdateDraft", "PUT", "/drafts/{id}", UpdateDraft, true,
	},
	Route{
		"RemoveDraft", "DELETE", "/drafts/{id}", RemoveDraft, true,
	},
	Route{
		"OPTIONSFavorite", "OPTIONS", "/favorites", OPTIONSFavorite, true,
	},
	Route{
		"OPTIONSUpdateUser", "OPTIONS", "/users/{id}/update", OPTIONSUpdateUser, true,
	},
	Route{
		"OPTIONSUpdateDraft", "OPTIONS", "/drafts/{id}", OPTIONSUpdateDraft, true,
	},
	Route{
		"OPTIONSRemoveDraft", "OPTIONS", "/drafts/{id}", OPTIONSRemoveDraft, true,
	},
	Route{
		"OPTIONSRemovePost", "OPTIONS", "/posts/{id}", OPTIONSRemovePost, true,
	},
	Route{
		"OPTIONSRemoveWantRead", "OPTIONS", "/posts/{id}", OPTIONSRemoveWantRead, true,
	},
	Route{
		"OPTIONSUpdatePost", "OPTIONS", "/posts", OPTIONSUpdatePost, true,
	},
	Route{
		"OPTIONSGetPost", "OPTIONS", "/posts/{id}", OPTIONSGetPost, true,
	},
}
