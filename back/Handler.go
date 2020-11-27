package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
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
		err := rows.Scan(&post.ID, &post.UserId, &post.Title, &post.Overview, &post.Link, &post.PostDate, &post.Thought)
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
	err := rows.Scan(&post.ID, &post.UserId, &post.Title, &post.Overview, &post.Link, &post.PostDate, &post.Thought)
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(&post)
}
func AddPost(w http.ResponseWriter, r *http.Request) {
	var post Post
	var postID int
	log.Println("add post is called")
	json.NewDecoder(r.Body).Decode(&post)
	err := A.DB.QueryRow("INSERT INTO posts (user_id, title, overview, link, thought) values($1, $2, $3, $4) RETURNING post_id;",
		post.UserId, post.Title, post.Overview, post.Link, post.Thought).Scan(&postID)
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
	err_1 := A.DB.QueryRow("INSERT INTO users (display_name, birthday, pass) values ($1 , $2 , $3) RETURNING user_id;",
		user.DisplayName, user.Birthday, string(hash)).Scan(&userID)
	if err_1 != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(userID)
}
func passwordVerify(hash, pw string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw))
}

// err := passwordVerify(hash, "入力されたパスワード")
// if err != nil {
//     panic(err)
// }

// println("認証しました")
//https://tool-taro.com/hash/ SHA1 mizuki
