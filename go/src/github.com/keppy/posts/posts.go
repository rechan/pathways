package posts

import {
  "github.com/boltdb/bolt"
}

type Parent struct {
  parent []string
  children [][]string
}

db, _ := bolt.Open('./db', 0666, nil)
defer db.Close()

func CreateCategory (name string) error {
  db.Update(func(tx *bolt.Tx) error {
    tx.CreateBucket([]byte(name))
    return nil
  }
}

func CreateParent (name string, content string) error {
  db.Update(func(tx *bolt.Tx) error {
    tx.CreateBucket([]byte(name))
    tx.Bucket([]byte(name)).Put([]byte("parent"), []byte(content))
    return nil
  }
}

func CreateChild (name string, content string, parent string) error {
  db.Update(func(tx *bolt.Tx) error {
    tx.Bucket([]byte(parent)).Put([]byte(name), []byte(content))
    return nil
  }
}

func GetParent (name string) struct {

  db.Update(func(tx *bolt.Tx) error {
    b := tx.Bucket([]byte(name))
    parent := b.Get([]byte("parent"))
    children := []string
    c = b.Cursor()

    for k, v := c.First(); k != nil; k, v = c.Next() {
      child := []string{k,v}
      children = append(children, child)
    }

    return nil
  }
  obj := Parent{parent,children}
  return obj
}
