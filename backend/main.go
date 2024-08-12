package main

import (
    "time"
    "context"
    "strings"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"

    "github.com/golang-jwt/jwt/v5"
    "github.com/gorilla/mux"

    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

type User struct {
    ID       uint   `gorm:"primaryKey;autoIncrement"`
    Nickname string `gorm:"unique;not null"`
    Email    string `gorm:"unique;not null"`
    Password string `gorm:"not null"`
}

type Post struct {
    ID     uint   `gorm:"primaryKey;autoIncrement"`
    Author uint   `gorm:"not null"` // Foreign key
    Title  string `gorm:"not null"`
    Body   string `gorm:"type:text"`
    Nickname string `gorm:"unique;not null"`

    // Define the relationship
    User User `gorm:"foreignKey:Author"`
}

var jwtSecret = []byte("symbio")

var db *gorm.DB

func main() {
    // Initialize the GORM connection
    dsn := "ran_symbio:symbio@tcp(localhost:3306)/symbio_db?charset=utf8mb4&parseTime=True&loc=Local"
    var err error
    db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    fmt.Println("Connected to the database successfully!")

    // Create a new router
    router := mux.NewRouter()

    // Define routes
    // Public route
    router.HandleFunc("/login", loginHandler).Methods(http.MethodPost)
    router.HandleFunc("/users/create", createUserHandler).Methods(http.MethodPost)

    // Protected routes
    protectedRoutes := router.PathPrefix("/").Subrouter()
    protectedRoutes.Use(jwtMiddleware)
    protectedRoutes.HandleFunc("/posts", getPostsHandler).Methods(http.MethodGet)
    protectedRoutes.HandleFunc("/posts/create", createPostHandler).Methods(http.MethodPost)
    protectedRoutes.HandleFunc("/posts/delete", deletePostHandler).Methods(http.MethodDelete)
    protectedRoutes.HandleFunc("/posts/update", updatePostHandler).Methods(http.MethodPut)
    protectedRoutes.HandleFunc("/users", getUsersHandler).Methods(http.MethodGet)
    protectedRoutes.HandleFunc("/users/delete", deleteUserHandler).Methods(http.MethodDelete)

    // Wrap the router with CORS and JSON content type middlewares
    enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

    // Print statement before starting the server
    fmt.Println("Server is running on port 8080")

    // Start server
    log.Fatal(http.ListenAndServe(":8080", enhancedRouter))
}

func getPostsHandler(w http.ResponseWriter, r *http.Request) {
    var posts []Post

    // Join the posts and users table to retrieve the posts along with the nickname of the author
    if result := db.Table("posts").
        Select("posts.id, posts.author, posts.title, posts.body, users.nickname").
        Joins("left join users on users.id = posts.author").
        Scan(&posts); result.Error != nil {
        log.Printf("Failed to retrieve posts from database: %v", result.Error)
        http.Error(w, "Failed to retrieve posts from database", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(posts)
}

// Handler to fetch all users
func getUsersHandler(w http.ResponseWriter, r *http.Request) {
    var users []User
    if result := db.Find(&users); result.Error != nil {
        log.Printf("Failed to retrieve users from database: %v", result.Error)
        http.Error(w, "Failed to retrieve users from database", http.StatusInternalServerError)
        return
    }

    // Encode the retrieved users into JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

// Handler to create a new post
func createPostHandler(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Title  string `json:"title"`
        Body   string `json:"body"`
    }

    // Decode the incoming JSON payload
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    // Retrieve the user ID from the JWT
    userID := r.Context().Value("user_id").(uint)

    // Create a new post
    post := Post{
        Title:  req.Title,
        Body:   req.Body,
        Author: userID,
    }

    if result := db.Create(&post); result.Error != nil {
        log.Printf("Failed to create post: %v", result.Error)
        http.Error(w, "Failed to create post", http.StatusInternalServerError)
        return
    }

    // Return the full new post object
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(post)
}

// Handler to create a new user
func createUserHandler(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Nickname string `json:"nickname"`
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    // Decode the incoming JSON payload
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    // Create a new user
    user := User{
        Nickname: req.Nickname,
        Email:    req.Email,
        Password: req.Password,
    }

    if result := db.Create(&user); result.Error != nil {
        log.Printf("Failed to create user: %v", result.Error)
        http.Error(w, "Failed to create user", http.StatusInternalServerError)
        return
    }

    // Return the created user
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

// Handler to delete a post by ID
func deletePostHandler(w http.ResponseWriter, r *http.Request) {
    idStr := r.URL.Query().Get("id")
    if idStr == "" {
        http.Error(w, "ID is required", http.StatusBadRequest)
        return
    }

    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        http.Error(w, "Invalid ID format", http.StatusBadRequest)
        return
    }

    result := db.Delete(&Post{}, id)
    if result.Error != nil {
        log.Printf("Failed to delete post: %v", result.Error)
        http.Error(w, "Failed to delete post", http.StatusInternalServerError)
        return
    }

    if result.RowsAffected == 0 {
        http.Error(w, "Post not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}

// Handler to delete a user by ID
func deleteUserHandler(w http.ResponseWriter, r *http.Request) {
    idStr := r.URL.Query().Get("id")
    if idStr == "" {
        http.Error(w, "ID is required", http.StatusBadRequest)
        return
    }

    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        http.Error(w, "Invalid ID format", http.StatusBadRequest)
        return
    }

    result := db.Delete(&User{}, id)
    if result.Error != nil {
        log.Printf("Failed to delete user: %v", result.Error)
        http.Error(w, "Failed to delete user", http.StatusInternalServerError)
        return
    }

    if result.RowsAffected == 0 {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}

// Handler to update a post by ID
func updatePostHandler(w http.ResponseWriter, r *http.Request) {
    var req struct {
        ID     uint   `json:"id"`
        Title  string `json:"title"`
        Body   string `json:"body"`
    }

    // Decode the incoming JSON payload
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    // Find the post by ID
    var post Post
    result := db.First(&post, req.ID)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            http.Error(w, "Post not found", http.StatusNotFound)
            return
        }
        log.Printf("Failed to retrieve post: %v", result.Error)
        http.Error(w, "Failed to retrieve post", http.StatusInternalServerError)
        return
    }

    // Update the post fields
    post.Title = req.Title
    post.Body = req.Body

    if result := db.Save(&post); result.Error != nil {
        log.Printf("Failed to update post: %v", result.Error)
        http.Error(w, "Failed to update post", http.StatusInternalServerError)
        return
    }

    // Return the updated post object
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(post)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    var user User
    result := db.Where("email = ? AND password = ?", req.Email, req.Password).First(&user)
    if result.Error != nil {
        http.Error(w, "Invalid email or password", http.StatusUnauthorized)
        return
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(time.Hour * 24).Unix(),
    })

    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "token": tokenString,
    })
}

// Middleware to require JWT authentication
func jwtMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            http.Error(w, "Authorization header is required", http.StatusUnauthorized)
            return
        }

        // Extract the token from the "Bearer" scheme
        tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

        // Parse and validate the token
        token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            return jwtSecret, nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Extract user ID from the token
        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            http.Error(w, "Invalid token claims", http.StatusUnauthorized)
            return
        }

        userIDFloat, ok := claims["user_id"].(float64)
        if !ok {
            http.Error(w, "Invalid token claims", http.StatusUnauthorized)
            return
        }

        userID := uint(userIDFloat)

        // Add the user ID to the request context
        ctx := context.WithValue(r.Context(), "user_id", userID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

// Middleware to enable CORS for all requests
func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if r.Method == "OPTIONS" {
            return
        }
        next.ServeHTTP(w, r)
    })
}

// Middleware to set the content type to JSON
func jsonContentTypeMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}
