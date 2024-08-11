package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

type User struct {
    ID       uint   `gorm:"primaryKey;autoIncrement"`
    Email    string `gorm:"unique;not null"`
    Password string `gorm:"not null"`
}

type Post struct {
    ID     uint   `gorm:"primaryKey;autoIncrement"`
    Author uint   `gorm:"not null"` // Foreign key
    Title  string `gorm:"not null"`
    Body   string `gorm:"type:text"`

    // Define the relationship
    User User `gorm:"foreignKey:Author"`
}

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
    router.HandleFunc("/posts", getPostsHandler).Methods(http.MethodGet)
    router.HandleFunc("/posts/create", createPostHandler).Methods(http.MethodPost)
    router.HandleFunc("/posts/delete", deletePostHandler).Methods(http.MethodDelete)
    router.HandleFunc("/posts/update", updatePostHandler).Methods(http.MethodPut)
    router.HandleFunc("/login", loginHandler).Methods(http.MethodPost)
    router.HandleFunc("/users", getUsersHandler).Methods(http.MethodGet)
    router.HandleFunc("/users/create", createUserHandler).Methods(http.MethodPost)
    router.HandleFunc("/users/delete", deleteUserHandler).Methods(http.MethodDelete)

    // Wrap the router with CORS and JSON content type middlewares
    enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

    // Print statement before starting the server
    fmt.Println("Server is running on port 8080")

    // Start server
    log.Fatal(http.ListenAndServe(":8080", enhancedRouter))
}

// Handler to fetch all posts
func getPostsHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var posts []Post
    if result := db.Preload("User").Find(&posts); result.Error != nil {
        log.Printf("Failed to retrieve posts from database: %v", result.Error)
        http.Error(w, "Failed to retrieve posts from database", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(posts)
}

// Handler to fetch all users
func getUsersHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var users []User
    if result := db.Find(&users); result.Error != nil {
        log.Printf("Failed to retrieve users from database: %v", result.Error)
        http.Error(w, "Failed to retrieve users from database", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

// Handler to create a new post
func createPostHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var req struct {
        Author uint   `json:"author"` // User ID
        Title  string `json:"title"`
        Body   string `json:"body"`
    }

    // Decode the incoming JSON payload
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    // Create a new post
    post := Post{
        Title:  req.Title,
        Body:   req.Body,
        Author: req.Author,
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
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var req struct {
        Email  string `json:"email"`
        Password   string `json:"password"`
    }

    // Decode the incoming JSON payload
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    // Create a new post
    user := User{
        Email:  req.Email,
        Password:   req.Password,
    }

    if result := db.Create(&user); result.Error != nil {
        log.Printf("Failed to create user: %v", result.Error)
        http.Error(w, "Failed to create user", http.StatusInternalServerError)
        return
    }

    // Return the full new post object
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

// Handler to delete a post by ID
func deletePostHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

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
    // Check if the request method is DELETE
    if r.Method != http.MethodDelete {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    // Get the user ID from the query parameters
    idStr := r.URL.Query().Get("id")
    if idStr == "" {
        http.Error(w, "ID is required", http.StatusBadRequest)
        return
    }

    // Convert the ID from string to uint
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        http.Error(w, "Invalid ID format", http.StatusBadRequest)
        return
    }

    // Delete the user from the database (assuming ID column in the database is named 'ID')
    result := db.Delete(&User{}, id)
    if result.Error != nil {
        log.Printf("Failed to delete user: %v", result.Error)
        http.Error(w, "Failed to delete user", http.StatusInternalServerError)
        return
    }

    // Check if any rows were affected (i.e., user found and deleted)
    if result.RowsAffected == 0 {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Respond with no content status
    w.WriteHeader(http.StatusNoContent)
}

// Handler to update a post by ID
func updatePostHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPut {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

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

// Handler to log in a user
func loginHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var req struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    // Decode the incoming JSON payload
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    var user User
    result := db.Where("email = ? AND password = ?", req.Email, req.Password).First(&user)
    
    // Log the SQL query and result
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            log.Printf("Login attempt failed: No user found with email %s", req.Email)
            http.Error(w, "Invalid email or password", http.StatusUnauthorized)
            return
        }
        log.Printf("Failed to execute query: %v", result.Error)
        http.Error(w, "Failed to log in", http.StatusInternalServerError)
        return
    }

    // Successful login
    log.Printf("Login successful for user: %+v", user)
    
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

// Middleware to enable CORS
func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Set CORS headers
        w.Header().Set("Access-Control-Allow-Origin", "*") // Allow any origin
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Check if the request is for CORS preflight
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        // Pass down the request to the next middleware (or final handler)
        next.ServeHTTP(w, r)
    })
}

// Middleware to set JSON Content-Type
func jsonContentTypeMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Set JSON Content-Type
        w.Header().Set("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}
