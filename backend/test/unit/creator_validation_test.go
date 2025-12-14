package unit

import (
	"reflect"
	"strings"
	"testing"

	"example.com/go-example-api/entity"
)

func TestCreatorStructTags(t *testing.T) {
	typ := reflect.TypeOf(entity.Creator{})

	// Check embedded gorm.Model exists
	if _, ok := typ.FieldByName("Model"); !ok {
		t.Fatalf("Creator should embed gorm.Model")
	}

	// Username field
	if f, ok := typ.FieldByName("Username"); ok {
		jsonTag := f.Tag.Get("json")
		if jsonTag != "username" {
			t.Errorf("expected json tag 'username' for Username, got '%s'", jsonTag)
		}
		gormTag := f.Tag.Get("gorm")
		if !strings.Contains(gormTag, "uniqueIndex") {
			t.Errorf("expected gorm tag to contain 'uniqueIndex' for Username, got '%s'", gormTag)
		}
	} else {
		t.Fatalf("Creator.Username field not found")
	}

	// Password field
	if f, ok := typ.FieldByName("Password"); ok {
		jsonTag := f.Tag.Get("json")
		if jsonTag != "password" {
			t.Errorf("expected json tag 'password' for Password, got '%s'", jsonTag)
		}
	} else {
		t.Fatalf("Creator.Password field not found")
	}

	// Email field
	if f, ok := typ.FieldByName("Email"); ok {
		jsonTag := f.Tag.Get("json")
		if jsonTag != "email" {
			t.Errorf("expected json tag 'email' for Email, got '%s'", jsonTag)
		}
		gormTag := f.Tag.Get("gorm")
		if !strings.Contains(gormTag, "uniqueIndex") {
			t.Errorf("expected gorm tag to contain 'uniqueIndex' for Email, got '%s'", gormTag)
		}
	} else {
		t.Fatalf("Creator.Email field not found")
	}
}
