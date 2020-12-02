package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// ============> Post
func GetPosts(w http.ResponseWriter, r *http.Request) {
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
}
func GetPost(w http.ResponseWriter, r *http.Request) {
	log.Println("Get post is called")
	var post Post
	params := mux.Vars(r)
	log.Println(params["id"])
	rows := A.DB.QueryRow("select * from posts where user_id = $1", params["id"])
	// rows := A.DB.QueryRow("select * from posts where user_id = 1")
	err := rows.Scan(&post.ID, &post.UserId, &post.PostDate, &post.Title, &post.Overview, &post.Link, &post.Thought, &post.Tags)
	if err != nil {
		log.Println(err)
	}
	log.Println(&post.PostDate)
	json.NewEncoder(w).Encode(&post)
}
func AddPost(w http.ResponseWriter, r *http.Request) {
	var post Post
	var postID int
	log.Println("add post is called")
	json.NewDecoder(r.Body).Decode(&post)
	err := A.DB.QueryRow("INSERT INTO posts (user_id, post_time , title, overview, link, thought) values($1, $2, $3, $4, $5, $6) RETURNING post_id;",
		post.UserId, post.PostDate, post.Title, post.Overview, post.Link, post.Thought).Scan(&postID)
	if err != nil {
		log.Println(err)
	}
	json.NewEncoder(w).Encode(postID)
}
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	var post Post
	log.Println("update post is called")
	json.NewDecoder(r.Body).Decode(&post)
	result, err := A.DB.Exec("UPDATE posts SET title=$1, overview=$2, link=$3, thought=$4 WHERE post_id=$5 RETURNING post_id",
		&post.Title, &post.Overview, &post.Link, &post.Thought, &post.ID)
	if err != nil {
		log.Println(err)
	}
	rowsUpdated, err := result.RowsAffected()
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(rowsUpdated)

}
func RemovePost(w http.ResponseWriter, r *http.Request) {
	log.Println("Remove post is called")
	params := mux.Vars(r)
	result, err := A.DB.Exec("DELETE FROM posts WHERE post_id = $1", params["id"])
	if err != nil {
		log.Println("err")
	}
	rowsDeleted, err := result.RowsAffected()
	if err != nil {
		log.Println("err")
	}
	fmt.Println("rowsDeleted", rowsDeleted)
	json.NewEncoder(w).Encode(rowsDeleted)
}

// ============> User

func AddUser(w http.ResponseWriter, r *http.Request) {
	var user User
	var userID int
	log.Println("add user id called")
	json.NewDecoder(r.Body).Decode(&user)
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Pass), 12)
	if err != nil {
		log.Fatal(err)
	}
	err_1 := A.DB.QueryRow("INSERT INTO users (display_name, birthday, pass, bio) values ($1 , $2 , $3, $4) RETURNING user_id;",
		user.DisplayName, user.Birthday, string(hash), user.BIO).Scan(&userID)
	if err_1 != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(userID)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	log.Printf("Get all users")
	var user User
	Users = []User{}
	rows, err := A.DB.Query("select * from users;")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&user.ID, &user.DisplayName, &user.Birthday, &user.Pass, &user.BIO)
		if err != nil {
			log.Println(err)
		}
		Users = append(Users, user)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
	}
	json.NewEncoder(w).Encode(Users)
}
func GetUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Get user")
	var user User
	params := mux.Vars(r)
	log.Println(params["id"])
	rows := A.DB.QueryRow("select * from users where user_id = $1", params["id"])
	// rows := A.DB.QueryRow("select * from posts where user_id = 1")
	err := rows.Scan(&user.ID, &user.DisplayName, &user.Birthday, &user.Pass, &user.BIO)
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(&user)
}
func UpdateUser(w http.ResponseWriter, r *http.Request) { //dont use this API yet
	var user User
	log.Println("update user is called")
	json.NewDecoder(r.Body).Decode(&user)
	result, err := A.DB.Exec("UPDATE users SET display_name = $1 where user_id = $2", &user.DisplayName, &user.ID)
	if err != nil {
		log.Fatal(err)
	}
	rowsUpdated, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(rowsUpdated)
}
func RemoveUser(w http.ResponseWriter, r *http.Request) {
	log.Println("delete user is called")
	params := mux.Vars(r)
	result, err := A.DB.Exec("DELETE FROM users WHERE user_id = $1", params["id"])
	if err != nil {
		log.Fatal(err)
	}
	rowsDeleted, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("rowsDeleted", rowsDeleted)
	json.NewEncoder(w).Encode(rowsDeleted)
}
func GetWantReads(w http.ResponseWriter, r *http.Request) {

}
func GetWantRead(w http.ResponseWriter, r *http.Request) {
	var wantread WantRead
	WantReads = []WantRead{}
	params := mux.Vars(r)
	log.Println("get wantread is called")
	rows, err := A.DB.Query("select * from wantreads where user_id = $1", params["id"])
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
}
func AddWantRead(w http.ResponseWriter, r *http.Request) {

}
func UpdateWantRead(w http.ResponseWriter, r *http.Request) {

}
func RemoveWantRead(w http.ResponseWriter, r *http.Request) {

}

// func passwordVerify(hash, pw string) error {
// 	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw))
// }

// err := passwordVerify(hash, "入力されたパスワード")
// if err != nil {
//     panic(err)
// }

// println("認証しました")
//https://tool-taro.com/hash/ SHA1 mizuki
