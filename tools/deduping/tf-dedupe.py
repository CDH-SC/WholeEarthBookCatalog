import csv
import tensorflow as tf
import tensforflow_hub as hub
import numpy as np
import re 

def csvReader(fname, delimiter, quotechar):
    with open(str(fname), "r", newline='\n') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=delimiter, quotechar=quotechar)
        return [x for x in csv_reader[:3000]]

words = csvReader("../../data/editions_batch.csv", '\t', '"')

model = hub.Module("https://tfhub.dev/google/elmo/2")

tensor = model(words)

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())
    sess.run(tf.tables_initializer())
    vectors = sess.run(tensor)

buckets = np.array([-np.ones(1024), np.ones(1024), np.arange(1024)]).T

buckets = buckets/np.sqrt(np.sum(buckets**2, axis=0))

indexes = np.argmax(np.matmul(vectors, buckets).T/(normalized_vectors), axis=0)

for vector, bucket in zip(vectors,indexes):
    compare = vectors[indexes == bucket]
    closeness = np.matmul(vector, compare.T)

    closeness /= np.sqrt(np.sum(vector**2))*np.sqrt(np.sum(compare**2, axis=1))
    print(np.array(titles)[indexes == bucket][closeness > .75])
