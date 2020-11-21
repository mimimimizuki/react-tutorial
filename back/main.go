package main

import (
   "encoding/json"
   "log"
   "net/http"
   "github.com/gorilla/mux"
   "strconv"
   "reflect"
)

type User struct {
   ID int `json:id`
   Birthday string `json:date`
   Pass string `json:pass`
}
type Post struct {
   ID int `json:id`
   Title string `json:title`
   Overview string `json:overview`
   Link string `json:link`
   PostDate string `json:postdate`
   Thought string `json:thought`
}

var posts []Post

func getPosts(w http.ResponseWriter, r *http.Request) {
   log.Printf("Get all posts")
   json.NewEncoder(w).Encode(posts)
}
func getPost(w http.ResponseWriter, r *http.Request) {
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
func addPost(w http.ResponseWriter, r *http.Request){
   log.Println("add post is called")
}
func updatePost(w http.ResponseWriter, r *http.Request){
   log.Println("update post is called")
}
func removePost(w http.ResponseWriter, r *http.Request) {
   log.Println("Remove post is called")
}

func main(){
   router := mux.NewRouter()

   posts = append(posts, 
      Post{ID:1, Title:"post1", Overview:"overview", Link: "http:///www.aaa", PostDate:"2020/11/20", Thought:"this is good"},
      Post{ID:2, Title:"post1", Overview:"overview", Link: "http:///www.aaa", PostDate:"2020/11/20", Thought:"this is good"},
   )

   router.HandleFunc("/posts", getPosts).Methods("GET")
   router.HandleFunc("/posts/{id}", getPost).Methods("GET")
   router.HandleFunc("/posts", addPost).Methods("POST")
   router.HandleFunc("/posts", updatePost).Methods("PUT")
   router.HandleFunc("/posts/{id}", removePost).Methods("DELETE")

   log.Println("listen sever .......")
   log.Fatal(http.ListenAndServe(":5000", router))
}