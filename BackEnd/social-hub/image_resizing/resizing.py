import pika
import base64
from PIL import Image
from io import BytesIO
import sqlite3
import json
import uuid


connection_params = pika.ConnectionParameters('localhost')

connection = pika.BlockingConnection(connection_params)

channel = connection.channel()

queue_name = 'resize_queue'
channel.queue_declare(queue=queue_name)

def callback(ch, method, properties, body):
    output_width = 380
    jsonObject = json.loads(body)
    img_data = base64.b64decode(jsonObject['image'])
    img = Image.open(BytesIO(img_data))
    image_link = f'{str(uuid.uuid4())}.{img.format}'
    w_percent = (output_width / float(img.size[0]))
    h_size = int((float(img.size[1]) * float(w_percent)))
    img = img.resize((output_width, h_size))
    
    print(image_link)
    post_id = str(jsonObject["id"]).replace('-', '')
    img.save(f'images/{image_link}')
    print(f'saved: {image_link}')
    print(f'id: {post_id}')
    sqlite_exec_commit('db.sqlite3', f"UPDATE server_post SET preview_image='{image_link}' WHERE id='{post_id}'", 
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


