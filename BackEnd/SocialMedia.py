import sqlite3

# Define a Post class
class Post:
    def __init__(self, image, text, user):
        self.image = image
        self.text = text
        self.user = user

# Initialize and connect to the SQLite database
conn = sqlite3.connect('social_media.db')
cursor = conn.cursor()

# Create a table to store posts
cursor.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        image TEXT,
        text TEXT,
        user TEXT
    )
''')
conn.commit()

# Function to store a post in the database
def store_post(post):
    cursor.execute('''
        INSERT INTO posts (image, text, user)
        VALUES (?, ?, ?)
    ''', (post.image, post.text, post.user))
    conn.commit()

# Function to retrieve the latest post
def get_latest_post():
    cursor.execute('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
    row = cursor.fetchone()
    return Post(row[1], row[2], row[3]) if row else None

# Example usage
post1 = Post("image1.jpg", "First post!", "user1")
store_post(post1)
latest_post = get_latest_post()

# Display the latest post
latest_post.__dict__ if latest_post else "No posts available"

"""
Defines a Post class: This class represents a social media post with attributes for an image, text, and user.

Initializes a SQLite database: A connection is established with a SQLite database named social_media.db. A table called posts is created if it does not exist, with columns for id, image, text, and user.

Implements store_post function: This function stores a post in the posts table. It takes a Post object as an argument and inserts its attributes into the table.

Implements get_latest_post function: This function retrieves the most recent post from the database. It selects the last row from the posts table and returns it as a Post object.

Example Usage:

A Post object post1 is created with sample data.
The store_post function is called to store post1 in the database.
The get_latest_post function is then called to retrieve the latest post.
The details of the latest post are displayed, showing that post1 has been successfully stored and retrieved.

"""
