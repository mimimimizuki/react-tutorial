package main

import (
	"log"
	"net/http"
	"os"
)

var A App

func main() {
	os.Setenv("APP_DB_USERNAME", "postgres")
	os.Setenv("APP_DB_PASSWORD", "")
	os.Setenv("APP_DB_NAME", "papers")
	A.Initialize(os.Getenv("APP_DB_USERNAME"),
		os.Getenv("APP_DB_PASSWORD"),
		os.Getenv("APP_DB_NAME"))
	A.Run(":5432")
	router := NewRouter()
	router.Use(forCORS)
	log.Println("listen sever .......")
	log.Fatal(http.ListenAndServe(":5000", router))

}

// CORSのためのミドルウェア
func forCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST,HEAD,PUT,PATCH,GET,DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		// プリフライトリクエストの対応
		if r.Method == "OPTIONS" {
			log.Println("here")
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method == "POST" {
			log.Println("HE")
			w.WriteHeader(http.StatusOK)
			return
		}
		log.Println(r.Method)
		next.ServeHTTP(w, r)
		return
	})
}

// curl -X POST  http://localhost:5000/posts  -data "ID=3&Title=post2&Overview=overview&Link=http:///www.bbb&PostDate=2020/11/13&Thought=this is good"
// curl -X DELETE http://localhost:5000/posts/:0

// curl -X POST -H 'Content-Type:application/json' -d '{\"ID\":3, \"Title\":\"post2\", \"Overview\":\"overview\", \"Link\":\"http://www.bba\", \"PostDate\":\"2020/11/13\", \"Thought\":\"this is good\"}' https://localhost:5000/posts
