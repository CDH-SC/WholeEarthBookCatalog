from jellyfish import jaro_distance
import numpy as np

# POC for getting a matrix jaro distance
def distance(i, j):
    global feature_dict
    return 1 - jaro_distance(feature_dict[i], feature_dict[j])


def get_dist_matrix(feature_dict):
    funcProxy = np.vectorize(distance)
    distance_matrix = np.fromfunction(funcProxy, shape=(len(feature_dict),len(feature_dict)))
    return distance_matrix


