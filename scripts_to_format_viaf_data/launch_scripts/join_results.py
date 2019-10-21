import os.path
import glob
import time
import subprocess

# Script to combine results from multiple nodes
# After catting all data together, gzips it and throws it in /backup/data/viaf_data/compressed for downloads
# Splits data in 30k, 3mil, and Full chunks


# Generate lists of all Directories and TSVs that should be present at the end
dirs = ["/backup/data/viaf_data/transfer/viaf-split-{}".format(x) for x in range(0,5)]
tsvs = ["/backup/data/viaf_data/transfer/viaf-out-{}.tsv".format(x) for x in range(0,5)]


# TODO clean this up, better ways to handle global vars
FULL_SPLIT = "/backup/data/viaf_data/uncompressed/viaf-full-split"
FULL_TSV = "/backup/data/viaf_data/uncompressed/viaf-out-full.tsv"

COMPRESSED_FULL_SPLIT = "/backup/data/viaf_data/compressed/viaf-full-split.tar.gz"
COMPRESSED_FULL_TSV = "/backup/data/viaf_data/compressed/viaf-out-full.tsv.gz"

THIRTY_K_SPLIT = "/backup/data/viaf_data/uncompressed/viaf-30k-split"
THIRTY_K_TSV = "/backup/data/viaf_data/uncompressed/viaf-out-30k.tsv"

COMPRESSED_THIRTY_K_SPLIT = "/backup/data/viaf_data/compressed/viaf-30k-split.tar.gz"
COMPRESSED_THIRTY_K_TSV = "/backup/data/viaf_data/compressed/viaf-out-30k.tsv.gz"

THREE_MIL_SPLIT = "/backup/data/viaf_data/uncompressed/viaf-3mil-split"
THREE_MIL_TSV = "/backup/data/viaf_data/uncompressed/viaf-out-3mil.tsv"

COMPRESSED_THREE_MIL_SPLIT = "/backup/data/viaf_data/compressed/viaf-3mil-split.tar.gz"
COMPRESSED_THREE_MIL_TSV = "/backup/data/viaf_data/compressed/viaf-out-3mil.tsv.gz"

SPLIT_SIZES = [None, 30000, 3000000]
SPLITS = [FULL_SPLIT, THIRTY_K_SPLIT, THREE_MIL_SPLIT]
COMPRESSED_SPLITS = [COMPRESSED_FULL_SPLIT, COMPRESSED_THIRTY_K_SPLIT, COMPRESSED_THREE_MIL_SPLIT]

TSVS_OUT = [FULL_TSV, THIRTY_K_TSV, THREE_MIL_TSV]
COMPRESSED_TSVS_OUT = [COMPRESSED_FULL_TSV, COMPRESSED_THIRTY_K_TSV, COMPRESSED_THREE_MIL_TSV]


# If a process errors out, print it and terminate
# TODO Error handling to kill all child processes on exit
def handleErr(proc=None, fname=None):
    if fname:
        print(fname)
    _,err = proc.communicate()
    print(err.decode('utf-8'))
    exit(1)
# Delete all old data and create blank files and directories in their place
for splt, tsv in zip(SPLITS, TSVS_OUT):

    if os.path.isdir(splt):
        p1 = subprocess.Popen(["rm", "-fr", splt], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        p1.wait()
        res1 = p1.returncode

    else:
        res1 = 0

    if res1 == 0:

        if os.path.isfile(tsv):
            p2 = subprocess.Popen(["rm",  tsv], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p2.wait()
            res2 = p2.returncode 

        else:
            res2 = 0

        if res2 == 0:

            p3 = subprocess.Popen(["touch", tsv], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p3.wait()

            if p3.returncode != 0:
                handleErr(p3)

            p4 = subprocess.Popen(["mkdir", splt], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p4.wait()
            
            if p4.returncode != 0:
                handleErr(p4)

        else:
            handleErr(p2)
    else:
        handleErr(p1)

# Tracks open processes
open_procs = []

# Tracks write locks on files. Don't want two processes writing to the same file
flocks = {}

# Tracks directories that are fully transferred
transferred = []

# Tracks files that have already been read
readp = []

# Until all files processed and all open processes are closed
while dirs or tsvs or open_procs:

    # Check if any completed processes
    # If done, delete them from the list and remove write lock
    for index, ps in enumerate(open_procs):
        resource, curr = ps
        if curr.poll() != None:
            if curr.returncode != 0:
                handleErr(curr)
            else:
                del open_procs[index]
                flocks[resource] = False

    # Check if any "." extensions present in directory, indicating incomplete rsync job
    # If not, append directory to completed transfers, and delete directory from global dir list
    for index, dname in enumerate(dirs):
        dir_globs = glob.glob("{}/.*".format(dname))        
        if not dir_globs and os.path.isdir(dname):
            transferred.append(dname)
            del dirs[index]

    # Enumerates over all fully transferred directories
    # Starts cat process to join results with FULL_SPLIT and FULL_TSV if write lock not present 
    for index,dname in enumerate(transferred):
        for fname in glob.glob("{}/*".format(dname)):
            f_ext = fname.split("/")[-1]
            flock = flocks.get(f_ext, None)
            if flock == None or flock == False and fname not in readp:
                readp.append(fname)
                open_procs.append([f_ext, subprocess.Popen("cat {} >> {}/{}".format(fname, FULL_SPLIT, f_ext), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)])
                flocks[f_ext] = True


    # Check if TSV files fully transfered
    tsv_globs = ["".join(x.partition(".tsv")[0:2]) for x in glob.glob("/backup/data/viaf_data/transfer/viaf-out-*.tsv.*")]
    for index, fname in enumerate(tsvs):
        # If TSV fully transfered, and the file exists, try to get a write lock
        if fname not in tsv_globs and os.path.isfile(fname):
            flock = flocks.get(FULL_TSV, None)
            if flock == False or flock == None:
                # If FULL_TSV not in use, write to it
                open_procs.append([FULL_TSV, subprocess.Popen("cat {} >> {}".format(fname,FULL_TSV), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)])
                
                flocks[FULL_TSV] = True
                # Delete tsv from files needed to be read
                del tsvs[index]

    # Sleep to avoid burning up CPU cycles since this is mostly IO based
    # TODO Use asyncio instead 
    time.sleep(2)

                  
# After FULL_TSV and FULL_SPLIT written, break files up into smaller splits and compress them
for splt, c_splt, tsv, c_tsv, splt_size in zip(SPLITS, COMPRESSED_SPLITS, TSVS_OUT, COMPRESSED_TSVS_OUT, SPLIT_SIZES):
    if splt_size != None:
        for fname in glob.glob("{}/*".format(FULL_SPLIT)):
            curr = subprocess.Popen("head -n {} {} >> {}/{}".format(splt_size, fname, splt, fname.split("/")[-1]), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            curr.wait()
            if curr.returncode != 0:
                handleErr(curr)
        curr = subprocess.Popen("head -n {} {} >> {}".format(splt_size, FULL_TSV, tsv), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        curr.wait()
        if curr.returncode != 0:
            handleErr(curr)

    p1 = subprocess.Popen(["tar","zkcvf", c_splt, splt])
    p2 = subprocess.Popen("gzip -c {} > {}".format(tsv, c_tsv), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    p1.wait()
    p2.wait()

    if p1.returncode != 0:
        handleErr(p1)
    if p2.returncode != 0:
        handleErr(p2)

    

