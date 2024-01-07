import pika
import base64
from PIL import Image
from io import BytesIO


connection_params = pika.ConnectionParameters('localhost')

connection = pika.BlockingConnection(connection_params)

channel = connection.channel()

queue_name = 'resize_queue'
channel.queue_declare(queue=queue_name)

def callback(ch, method, properties, body):
    output_width = 200
    img_data = base64.b64decode(body)
    img = Image.open(BytesIO(img_data))
    w_percent = (output_width / float(img.size[0]))
    h_size = int((float(img.size[1]) * float(w_percent)))
    img = img.resize((output_width, h_size))
    img.save('resized_image.jpg')

channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

print('Waiting for messages. To exit press CTRL+C')

try:
    channel.start_consuming()
except KeyboardInterrupt:
    channel.stop_consuming()

# Close the connection
connection.close()
