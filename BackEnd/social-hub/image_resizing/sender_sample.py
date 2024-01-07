import pika
import base64


with open("sample.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read())


connection_params = pika.ConnectionParameters('localhost')

connection = pika.BlockingConnection(connection_params)

channel = connection.channel()

queue_name = 'resize_queue'
channel.queue_declare(queue=queue_name)

message = encoded_string

channel.basic_publish(exchange='', routing_key=queue_name, body=message)
print(f"Sent sample image")

connection.close()
