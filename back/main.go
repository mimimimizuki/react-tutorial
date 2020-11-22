package main

import (
   "database/sql"
   "encoding/json"
   "log"
   "net/http"
   "github.com/gorilla/mux"
   "strconv"
   "reflect"
   "time"
   _ "github.com/lib/pq"
)

type User struct {
   ID int `json:"id"`
   Birthday time.Time `json:"birthday"`
   Pass string `json:"pass"`
}
type Post struct {
   ID int `json:"id"`
   Title string `json:"title"`
   Overview string `json:"overview"`
   Link string `json:"link"`
   PostDate string `json:"postdate"`
   Thought string `json:"thought"`
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
   var post Post
   json.NewDecoder(r.Body).Decode(&post)
   log.Println("post: ", post)
   posts = append(posts, post)
   json.NewEncoder(w).Encode(posts)
   log.Println("add post is called")
}
func updatePost(w http.ResponseWriter, r *http.Request){
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
func removePost(w http.ResponseWriter, r *http.Request) {
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

func main(){
   db, err := sql.Open("postgres", "host=127.0.0.1 port=3000 user=root password=password dbname=papers")
   defer db.Close()
   if err != nil {
      log.Println(err)
   }
   router := mux.NewRouter()

   posts = append(posts, 
      Post{ID:1, Title:"post1", Overview:"overview", Link: "http:///www.aaa", PostDate:"2020/11/11", Thought:"this is good"},
      Post{ID:2, Title:"post1", Overview:"overview", Link: "http:///www.aaa", PostDate:"2020/11/12", Thought:"this is good"},
   )

   router.HandleFunc("/posts", getPosts).Methods("GET")
   router.HandleFunc("/posts/{id}", getPost).Methods("GET")
   router.HandleFunc("/posts", addPost).Methods("POST")
   router.HandleFunc("/posts", updatePost).Methods("PUT")
   router.HandleFunc("/posts/{id}", removePost).Methods("DELETE")

   log.Println("listen sever .......")
   log.Fatal(http.ListenAndServe(":5000", router))
}

// curl -X POST  http://localhost:5000/posts  -data "ID=3&Title=post2&Overview=overview&Link=http:///www.bbb&PostDate=2020/11/13&Thought=this is good" 
// curl -X DELETE http://localhost:5000/posts/:0

// curl -X POST -H 'Content-Type:application/json' -d '{\"ID\":3, \"Title\":\"post2\", \"Overview\":\"overview\", \"Link\":\"http://www.bba\", \"PostDate\":\"2020/11/13\", \"Thought\":\"this is good\"}' https://localhost:5000/posts