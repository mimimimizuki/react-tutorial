package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// ============> Post

// GetPosts is return all posts

// func GetPosts(w http.ResponseWriter, r *http.Request) {
// 	log.Printf("Get all posts")
// 	var post Post
// 	Posts = []Post{}

// 	rows, err := A.DB.Query("select * from posts;")
// 	if err != nil {
// 		log.Println(err)
// 	}
// 	defer rows.Close()
// 	for rows.Next() {
// 		err := rows.Scan(&post.ID, &post.UserId, &post.PostDate, &post.Title, &post.Overview, &post.Link, &post.Thought, pq.Array(&post.Tags))
// 		if err != nil {
// 			log.Println(err)
// 		}
// 		Posts = append(Posts, post)
// 	}
// 	if err = rows.Err(); err != nil {
// 		log.Println(err)
// 	}
// 	json.NewEncoder(w).Encode(Posts)
// }

// GetPost is return one user's posts
func GetPost(w http.ResponseWriter, r *http.Request) {
	log.Println("Get post is called")
	var post Post
	params := mux.Vars(r)
	Posts = []Post{}
	rows, err := A.DB.Query("select * from posts where user_id = $1;", params["id"])
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&post.ID, &post.UserId, &post.PostDate, &post.Title, &post.Overview, &post.Link, &post.Thought, pq.Array(&post.Tags))
		if err != nil {
			log.Fatal(err)
		}
		Posts = append(Posts, post)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
	}
	json.NewEncoder(w).Encode(Posts)
}

// GetPostDetail is  a function to show post detail
func GetPostDetail(w http.ResponseWriter, r *http.Request) {
	log.Println("Get post by post_id is called")
	var post Post
	params := mux.Vars(r)
	rows := A.DB.QueryRow("select * from posts where post_id = $1;", params["post_id"])
	err := rows.Scan(&post.ID, &post.UserId, &post.PostDate, &post.Title, &post.Overview, &post.Link, &post.Thought, pq.Array(&post.Tags))
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(post)
}

// AddPost is to add posts of one users
func AddPost(w http.ResponseWriter, r *http.Request) {
	post := Post{}
	var postID int
	log.Println("add post is called")
	post.UserId, _ = strconv.Atoi(r.FormValue("UserId"))
	post.PostDate = r.FormValue("PostDate")
	post.Title = r.FormValue("Title")
	post.Overview = r.FormValue("Overview")
	post.Link = r.FormValue("Link")
	post.Thought = r.FormValue("Thought")
	err := A.DB.QueryRow("INSERT INTO posts (user_id, post_time , title, overview, link, thought, tags) values($1, $2, $3, $4, $5, $6 , $7) RETURNING post_id;",
		post.UserId, post.PostDate, post.Title, post.Overview, post.Link, post.Thought, pq.Array(r.FormValue("Tags"))).Scan(&postID)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(postID)
}

// UpdatePost is to update a post which one users posted
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

// RemovePost is to delete a post which one user want to delete
func RemovePost(w http.ResponseWriter, r *http.Request) {
	log.Println("Remove post is called")
	params := mux.Vars(r)
	result, err := A.DB.Exec("DELETE FROM posts WHERE post_id = $1;", params["id"])
	if err != nil {
		log.Println(err)
	}
	rowsDeleted, err := result.RowsAffected()
	if err != nil {
		log.Println("err")
	}
	fmt.Println("rowsDeleted", rowsDeleted)
	json.NewEncoder(w).Encode(rowsDeleted)
}

// ============> User

// AddUser is to create new account
func AddUser(w http.ResponseWriter, r *http.Request) {
	var user User
	var userID int
	log.Println("add user id called")
	json.NewDecoder(r.Body).Decode(&user)
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Pass), 12)
	if err != nil {
		log.Fatal(err)
	}
	err1 := A.DB.QueryRow("INSERT INTO users (display_name, birthday, pass, bio) values ($1 , $2 , $3, $4) RETURNING user_id;",
		user.DisplayName, user.Birthday, string(hash), user.BIO).Scan(&userID)
	if err1 != nil {
		log.Fatal(err1)
	}
	json.NewEncoder(w).Encode(userID)
}

// GetUsers is maybe not used
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

// GetUser is to get one user infomation about diaplayname or bio ...
func GetUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Get user")
	var user User
	params := mux.Vars(r)
	log.Println(params["id"])
	rows := A.DB.QueryRow("select * from users where user_id = $1", params["id"])
	err := rows.Scan(&user.ID, &user.DisplayName, &user.Birthday, &user.Pass, &user.BIO)
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(&user)
}

// UpdateUser is to update user infomation
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	var user User
	params := mux.Vars(r)
	log.Println("update user is called")
	json.NewDecoder(r.Body).Decode(&user)

	result, err := A.DB.Exec("UPDATE users SET display_name = '" + user.DisplayName + "', bio = '" + user.BIO + "' where user_id = " + params["id"])
	if err != nil {
		log.Fatal(err)
	}
	rowsUpdated, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(rowsUpdated)
}

// RemoveUser is to delete account
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

// ============> wantread

// GetWantReads is maybe not used
func GetWantReads(w http.ResponseWriter, r *http.Request) {
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
}

// GetWantRead is to return papers which one user to want to read
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

// AddWantRead is to add user's wanna read paper
func AddWantRead(w http.ResponseWriter, r *http.Request) {
	wantread := WantRead{}
	var wantreadID int
	log.Println("add want read is called")
	wantread.UserId, _ = strconv.Atoi(r.FormValue("UserId"))
	wantread.Title = r.FormValue("Title")
	wantread.Link = r.FormValue("Link")
	err := A.DB.QueryRow("INSERT INTO wantreads (user_id, title, link) values ($1, $2, $3) RETURNING want_id;",
		wantread.UserId, wantread.Title, wantread.Link).Scan(&wantreadID)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(wantreadID)
}

// UpdateWantRead is maybe used for change this paper to post(already read)
func UpdateWantRead(w http.ResponseWriter, r *http.Request) {
	var wantread WantRead
	log.Println("update wantread is called")
	json.NewDecoder(r.Body).Decode(&wantread)
	result, err := A.DB.Exec("UPDATE wantreads SET title=$1, link=$2 WHERE wantread_id = $3",
		&wantread.Title, &wantread.Link, &wantread.ID)
	if err != nil {
		log.Fatal(err)
	}
	rowsUpdated, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(rowsUpdated)
}

// RemoveWantRead is maybe used for change this paper to post(already read)
func RemoveWantRead(w http.ResponseWriter, r *http.Request) {
	log.Println("delete wantread is called")
	params := mux.Vars(r)
	result, err := A.DB.Exec("DELETE FROM wantreads WHERE wantread_id = $1", params["id"])
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

// ============> favorite

// AddFavorite is to add favorite to a post
func AddFavorite(w http.ResponseWriter, r *http.Request) {
	log.Println("add favorite is called")
	var favoriteID int
	err := A.DB.QueryRow("INSERT INTO favorites (user_id, post_id ) VALUES ($1, $2) RETURNING favorite_id ; ", r.FormValue("UserId"), r.FormValue("PostId")).Scan(&favoriteID)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(favoriteID)
}

// RemoveFavorite is a function to delete action which a user click a post to preserve favoritesList
func RemoveFavorite(w http.ResponseWriter, r *http.Request) {
	log.Println("delete favorite is called")
	favorite := Favorite{}
	favorite.PostId, _ = strconv.Atoi(r.FormValue("PostId"))
	favorite.UserId, _ = strconv.Atoi(r.FormValue("UserId"))
	result, err := A.DB.Exec("DELETE FROM favorites WHERE post_id= $1 and user_id = $2", favorite.PostId, favorite.UserId)
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

// GetFavorite is to return posts which a user liked
func GetFavorite(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var favoritePost Post
	Posts = []Post{}
	log.Println("get favorites is called")
	rows, err := A.DB.Query("SELECT * FROM posts where post_id = (SELECT post_id FROM favorites WHERE user_id = $1)", params["id"])
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&favoritePost.ID, &favoritePost.UserId,
			&favoritePost.PostDate, &favoritePost.Title, &favoritePost.Overview, &favoritePost.Link, &favoritePost.Thought, pq.Array(&favoritePost.Tags))
		if err != nil {
			log.Fatal(err)
		}
		Posts = append(Posts, favoritePost)
	}
	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(Posts)
}

// GetSearchPost is the most important , search function . now can search from tags
func GetSearchPost(w http.ResponseWriter, r *http.Request) {
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
}

// OPTIONSFavorite is prelight process
func OPTIONSFavorite(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// OPTIONSUpdateUser is preflight process
func OPTIONSUpdateUser(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// OPTIONSUpdateDraft is preflight process
func OPTIONSUpdateDraft(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// OPTIONSRemoveDraft is preflight process
func OPTIONSRemoveDraft(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func OPTIONSRemovePost(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func OPTIONSUpdatePost(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// ================> Draft

// AddDraft is a funtion to preserve incomplete posts
func AddDraft(w http.ResponseWriter, r *http.Request) {
	log.Println("add draft is called")
	draft := Draft{}
	var draftID int
	draft.UserId, _ = strconv.Atoi(r.FormValue("UserId"))
	draft.Title = r.FormValue("Title")
	draft.Overview = r.FormValue("Overview")
	draft.Link = r.FormValue("Link")
	draft.Thought = r.FormValue("Thought")
	tags := []string{}
	for k, v := range r.Form {
		if k == "Tags" {
			tags = v
		}
	}
	err := A.DB.QueryRow("INSERT INTO drafts  (user_id , title, overview, link, thought, tags) values($1, $2, $3, $4, $5, $6) RETURNING draft_id;",
		draft.UserId, draft.Title, draft.Overview, draft.Link, draft.Thought, pq.Array(tags)).Scan(&draftID)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(draftID)
}

// GetDraft returns a user's drarft (draft is only one)
func GetDraft(w http.ResponseWriter, r *http.Request) {
	log.Println("get draft is called")
	var draft Draft
	params := mux.Vars(r)
	rows := A.DB.QueryRow("SELECT * FROM drafts WHERE user_id = $1;", params["id"])
	err := rows.Scan(&draft.ID, &draft.UserId, &draft.Title, &draft.Overview, &draft.Link, &draft.Thought, pq.Array(&draft.Tags))
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(draft)
}

// RemoveDraft is a function to remove draft
func RemoveDraft(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	log.Println("delete draft is called")
	result, err := A.DB.Exec("DELETE FROM drafts WHERE draft_id= $1;", params["id"])
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

// UpdateDraft is a function to update drafts
func UpdateDraft(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var draft Draft
	log.Println("update draft is called")
	json.NewDecoder(r.Body).Decode(&draft)
	result, err := A.DB.Exec("UPDATE drafts SET title=$1, overview=$2, link=$3, thought=$4, tags = $5 WHERE draft_id = $6",
		&draft.Title, &draft.Overview, &draft.Link, &draft.Thought, pq.Array(&draft.Tags), params["id"])
	if err != nil {
		log.Fatal(err)
	}
	rowsUpdated, err := result.RowsAffected()
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(rowsUpdated)
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
