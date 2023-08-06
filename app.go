package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SaveFile(title string, defaultFilename string, fileFilterDisplay string, fileFilterPattern string, base64Content string) string {
	file, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           title,
		DefaultFilename: defaultFilename,
		Filters: []runtime.FileFilter{{
			DisplayName: fileFilterDisplay,
			Pattern:     fileFilterPattern,
		}},
	})
	if err != nil {
		return err.Error()
	}

	// Decode base64 content
	bytes, err := base64.StdEncoding.DecodeString(base64Content)
	if err != nil {
		return err.Error()
	}

	// Write file
	err = os.WriteFile(file, bytes, 0644)
	if err != nil {
		return err.Error()
	}

	return file
}
