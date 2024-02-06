package main

import (
	"github.com/gorilla/mux"
	"io/fs"
	"log"
	"mvm.tf"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var UseEmbed = "true"

func startServer(config *Config) {
	store = initStore(config)
	if store == nil {
		log.Fatal("Can't init session store")
	}

	handler := initHandlers(config)

	log.Printf("Listening on port %d\n", config.HTTP.Port)
	err := http.ListenAndServeTLS(":"+strconv.Itoa(config.HTTP.Port), config.HTTP.HttpsCertFile, config.HTTP.HttpsKeyFile, handler)
	log.Fatal(err)
}

func initHandlers(config *Config) *mux.Router {
	var assetsFs = &assets.Assets

	var useFS fs.FS

	if UseEmbed == "true" {
		fsys := fs.FS(assetsFs)
		useFS, _ = fs.Sub(fsys, "build/client")
	} else {
		log.Println("Using build directory")
		useFS = os.DirFS("build/client")
	}

	r := mux.NewRouter()
	r.Use(rewriteURL)
	r.PathPrefix("/").Handler(&RecoveryHandler{Handler: http.FileServer(http.FS(useFS))})

	return r
}

func rewriteURL(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/@") {
			r.URL.Path = "/"
		}
		next.ServeHTTP(w, r)
	})
}
