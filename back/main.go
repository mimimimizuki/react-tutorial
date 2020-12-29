package main

import (
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
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
	corsWrapper := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Origin", "Accept", "*"},
	})
	// router.Use(forCORS)
	log.Println("listen sever .......")
	// log.Fatal(http.ListenAndServe(":5000", router))
	log.Fatal(http.ListenAndServe(":5000", corsWrapper.Handler(router)))
}

// CORSのためのミドルウェア
func forCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
			w.Header().Set("Access-Control-Allow-Headers", "*")
			w.Header().Set("Access-Control-Allow-Methods", "OPTIONS,PUT,GET,DELETE,OPTIONS, POST")
			w.Header().Set("Access-Control-Max-Age", "100000")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			log.Println(r.Method)
			// プリフライトリクエストの対応
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				log.Println("options is called")
				log.Println(r.Header.Get("authorization"))
				return
			}
			next.ServeHTTP(w, r)
			return
		})
}

// curl -X POST  http://localhost:5000/posts  -data "ID=3&Title=post2&Overview=overview&Link=http:///www.bbb&PostDate=2020/11/13&Thought=this is good"
// curl -X DELETE http://localhost:5000/posts/:0

// curl -X POST -H 'Content-Type:application/json' -d '{\"ID\":3, \"Title\":\"post2\", \"Overview\":\"overview\", \"Link\":\"http://www.bba\", \"PostDate\":\"2020/11/13\", \"Thought\":\"this is good\"}' https://localhost:5000/posts
