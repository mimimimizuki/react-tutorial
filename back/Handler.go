package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/lib/pq"
)

// ============> Post

// GetPosts is return all posts
var GetPosts = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	log.Printf("Get all posts")
	var post Post
	Posts = []Post{}

	rows, err := A.DB.Query("select * from posts;")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&post.ID, &post.UserId, &post.PostDate, &post.Title, &post.Overview, &post.Link, &post.Thought, pq.Array(&post.Tags))
		if err != nil {
			log.Println(err)
		}
		Posts = append(Posts, post)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
	}
	json.NewEncoder(w).Encode(Posts)
})

// GetPostDetail is  a function to show post detail
var GetPostDetail = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	log.Println("Get post by post_id is called")
	var post Post
	params := mux.Vars(r)
	rows := A.DB.QueryRow("select * from posts where post_id = $1;", params["post_id"])
	err := rows.Scan(&post.ID, &post.UserId, &post.PostDate, &post.Title, &post.Overview, &post.Link, &post.Thought, pq.Array(&post.Tags))
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(post)
})

// ============> User

// AddUser is to create new account
var AddUser = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	var user User
	var userID int
	log.Println("add user id called")
	json.NewDecoder(r.Body).Decode(&user)
	err1 := A.DB.QueryRow("INSERT INTO users (display_name, auth_id, bio) values ($1 , $2 , $3) RETURNING user_id;",
		user.DisplayName, user.AuthID, user.BIO).Scan(&userID)
	if err1 != nil {
		log.Fatal(err1)
	}
	json.NewEncoder(w).Encode(userID)
})

// GetUsers is maybe not used
var GetUsers = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	log.Printf("Get all users")
	var user User
	Users = []User{}
	rows, err := A.DB.Query("select * from users;")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&user.ID, &user.DisplayName, &user.AuthID, &user.BIO)
		if err != nil {
			log.Println(err)
		}
		Users = append(Users, user)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
	}
	json.NewEncoder(w).Encode(Users)
})

// GetOtherUser is to get Other user infomation about diaplayname or bio ...
var GetOtherUser = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	log.Println("Get user")
	var user User
	params := mux.Vars(r)
	log.Println(params["id"])
	rows := A.DB.QueryRow("select * from users where user_id = $1;", params["id"])
	err := rows.Scan(&user.ID, &user.DisplayName, &user.BIO, &user.AuthID)
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(&user)
})

// ============> wantread

// GetWantReads is maybe not used
var GetWantReads = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	var wantread WantRead
	WantReads = []WantRead{}
	log.Println("get wantread is called")
	rows, err := A.DB.Query("select * from wantreads")
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&wantread.ID, &wantread.UserId, &wantread.Title, &wantread.Link)
		if err != nil {
			log.Fatal(err)
		}
		WantReads = append(WantReads, wantread)
	}
	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(WantReads)
})

// GetSearchPost is the most important , search function . now can search from tags
var GetSearchPost = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	var searchPost Post
	var arr string
	Posts = []Post{}
	for k, v := range r.URL.Query() {
		if k != "tags" {
			log.Fatal("no tags parameter")
		}
		for i := range v {
			rows, err := A.DB.Query("SELECT * FROM (SELECT * , unnest(tags) as arr FROM posts) as t WHERE arr LIKE $1;", v[i]+"%")

			if err != nil {
				log.Fatal(err)
			}
			defer rows.Close()
			for rows.Next() {
				err := rows.Scan(&searchPost.ID, &searchPost.UserId,
					&searchPost.PostDate, &searchPost.Title, &searchPost.Overview, &searchPost.Link, &searchPost.Thought, pq.Array(&searchPost.Tags), &arr)
				if err != nil {
					log.Fatal(err)
				}
				Posts = append(Posts, searchPost)
			}
			if err = rows.Err(); err != nil {
				log.Fatal(err)
			}
		}
	}
	json.NewEncoder(w).Encode(Posts)
})
