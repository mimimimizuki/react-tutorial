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
		"GetPostDetail", "GET", "/posts/{post_id}/detail", GetPostDetail,
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
		"AddUser", "POST", "/users", AddUser,
	},
	Route{
		"GetUsers", "GET", "/users", GetUsers,
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
	Route{
		"GetWantReads", "GET", "/wantReads", GetWantReads,
	},
	Route{
		"GetWantRead", "GET", "/wantReads/{id}", GetWantRead,
	},
	Route{
		"AddWantRead", "POST", "/wantReads", AddWantRead,
	},
	Route{
		"UpdateWantRead", "PUT", "/wantReads", UpdateWantRead,
	},
	Route{
		"RemoveWantRead", "DELETE", "/wantReads/{id}", RemoveWantRead,
	},
	Route{
		"AddFavorite", "POST", "/favorites", AddFavorite,
	},
	Route{
		"RemoveFavorite", "DELETE", "/favorites", RemoveFavorite,
	},
	Route{
		"GetFavorite", "GET", "/favorites/{id}", GetFavorite,
	},
	Route{
		"GetSearchPost", "GET", "/search", GetSearchPost,
	},
	Route{
		"OPTIONSFavorite", "OPTIONS", "/favorites", OPTIONSFavorite,
	},
	Route{
		"OPTIONSUpdateUser", "OPTIONS", "/users/{id}", OPTIONSUpdateUser,
	},
	Route{
		"OPTIONSUpdateDraft", "OPTIONS", "/drafts/{id}", OPTIONSUpdateDraft,
	},
	Route{
		"OPTIONSRemoveDraft", "OPTIONS", "/drafts/{id}", OPTIONSRemoveDraft,
	},
	Route{
		"OPTIONSRemovePost", "OPTIONS", "/posts/{id}", OPTIONSRemovePost,
	},
	Route{
		"OPTIONSUpdatePost", "OPTIONS", "/posts", OPTIONSUpdatePost,
	},
	Route{
		"AddDraft", "POST", "/drafts", AddDraft,
	},
	Route{
		"GetDraft", "GET", "/drafts/{id}", GetDraft,
	}, Route{
		"UpdateDraft", "PUT", "/drafts/{id}", UpdateDraft,
	}, Route{
		"RemoveDraft", "DELETE", "/drafts/{id}", RemoveDraft,
	},
}
