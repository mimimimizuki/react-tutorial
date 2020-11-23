package main

import (
   "log"
   "net/http"
   "os"
)


// type Draft struct {
//    ID int
//    UserId int
//    Title string 
//    Overview string 
//    Link string
//    PostDate string 
//    Thought string 
// }
// type Favorite struct {
//    ID int 
//    UserId int
//    PostId int 
// }
// type WantRead struct {
//    ID int
//    UserId int
//    Title string 
//    Link string
// }



func main(){
   os.Setenv("APP_DB_USERNAME", "postgres")
   os.Setenv("APP_DB_PASSWORD", "")
   os.Setenv("APP_DB_NAME", "papers")
   a := App{}
   a.Initialize(os.Getenv("APP_DB_USERNAME"),
               os.Getenv("APP_DB_PASSWORD"),
               os.Getenv("APP_DB_NAME"))
   a.Run(":5432")
   router := NewRouter()

   log.Println("listen sever .......")
   log.Fatal(http.ListenAndServe(":5000", router))

}

// curl -X POST  http://localhost:5000/posts  -data "ID=3&Title=post2&Overview=overview&Link=http:///www.bbb&PostDate=2020/11/13&Thought=this is good" 
// curl -X DELETE http://localhost:5000/posts/:0

// curl -X POST -H 'Content-Type:application/json' -d '{\"ID\":3, \"Title\":\"post2\", \"Overview\":\"overview\", \"Link\":\"http://www.bba\", \"PostDate\":\"2020/11/13\", \"Thought\":\"this is good\"}' https://localhost:5000/posts