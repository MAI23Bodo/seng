
#import tensorflow as tf
import pika
import base64
from PIL import Image
from io import BytesIO
import sqlite3
import json
import uuid
from transformers import pipeline

#pip install tensorflow
#pip install pika
#pip install pillow
#pip install -q transformers

sentiment_pipeline = pipeline("sentiment-analysis")
#data = ["I love you", "I hate you"]
#sentiment_pipeline(data)


#[{'label': 'POSITIVE', 'score': 0.9998656511306763},
# {'label': 'NEGATIVE', 'score': 0.9991129040718079}]


connection_params = pika.ConnectionParameters('localhost')

connection = pika.BlockingConnection(connection_params)

channel = connection.channel()

queue_name = 'ai_queue'
channel.queue_declare(queue=queue_name)

def callback(ch, method, properties, body):
    
    jsonObject = json.loads(body)
    message = jsonObject["message"]
    sentiment = sentiment_pipeline(message)
    print(sentiment)

    post_id = str(jsonObject["id"]).replace('-', '')
    
    print(f'id: {post_id}')
    sqlite_exec_commit('db.sqlite3', f"UPDATE server_post SET sentiment='{sentiment[0]['label'].lower()}' WHERE id='{post_id}'", 
                      verbose=True)

def sqlite_exec_commit(sqlite_db, sql, verbose: bool=False):
    try:
        sqlite_connection = sqlite3.connect(sqlite_db)
        if verbose:
            print("Opened SQLite connection.")
        cur = sqlite_connection.cursor()
        cur.execute(sql)
        print(f'count: {cur.rowcount}')
        sqlite_connection.commit()
        result = cur.fetchall()
        print(result)
        cur.close()
        return result
    except sqlite3.Error as error:
        print("\nError while connecting to sqlite")
        raise error
    finally:
        # regardless of errors: close the database connection
        if (sqlite_connection):
            sqlite_connection.close()
            if verbose:
                print("Closed SQLite connection.")

channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

print('Waiting for messages. To exit press CTRL+C')

try:
    channel.start_consuming()
except KeyboardInterrupt:
    channel.stop_consuming()

# Close the connection
connection.close()



            
# SQL-statement to get the version of our database


