package main

import (
	"encoding/json"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"reflect"
	"strconv"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
	log.Printf("Get all posts")
	json.NewEncoder(w).Encode(posts)
}
 func GetPost(w http.ResponseWriter, r *http.Request) {
	log.Println("Get post is called")
	params := mux.Vars(r)
	log.Println(params)

	log.Println(reflect.TypeOf(params["id"]))
	i, _ := strconv.Atoi(params["id"])

	for _, post := range posts {
		if post.ID == i{
			json.NewEncoder(w).Encode(&post)
		}
	}
}
func AddPost(w http.ResponseWriter, r *http.Request){
	var post Post
	json.NewDecoder(r.Body).Decode(&post)
	log.Println("post: ", post)
	posts = append(posts, post)
	json.NewEncoder(w).Encode(posts)
	log.Println("add post is called")
}
func UpdatePost(w http.ResponseWriter, r *http.Request){
	var post Post
	json.NewDecoder(r.Body).Decode(&post)

	for i, post := range posts{
		if post.ID == post.ID{
			posts[i] = post
		} 
	}
	json.NewEncoder(w).Encode(post)
	log.Println("update post is called")
}
func RemovePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	log.Println(params)
	id, _ := strconv.Atoi(params["id"])
	log.Println("id: ", id)
	log.Println("posts: ", posts)
	for i, post := range posts {
		if post.ID == id {
			posts = append(posts[:i], posts[i+1:]...)
		}  
	}
	json.NewEncoder(w).Encode(posts)
	log.Println("Remove post is called")
}