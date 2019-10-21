import argparse
import msgpack
import mulitiprocessing as mp
import zmq

def consumeWork(node, queue):

def mainQueue(nodes, outfile, out_dir, queue):

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process Messages from Worker Nodes')
    parser.add_argument('--nodes', '-n', help='Infile list of nodes to connect', required=True)
    parser.add_argument('--outfile', '-o', help='Outfile (TSV) name', required=True)
    parser.add_argument('--split-dir', '-s', help='Directory for split files', required=True)
    with open(args.nodes, "r") as handle:
        nodes = [x.strip() for x in handle.readlines()]
    outfile = args.outfile
    out_dir = args.split_dir
    queue = mp.Queue()
    mainQueue(nodes, outfile, out_dir, queue)
